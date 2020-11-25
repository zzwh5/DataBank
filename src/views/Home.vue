<template>
  <div class="data-bank">
    <div class="header">
      <div class="search">
        <a-form
          layout="inline"
          class="ant-advanced-search-form"
          :form="formsearch"
          @submit="handleSearch"
        >
          <a-row :gutter="48" style="display: flex; align-items: center">
            <template v-for="item in searchcolumns">
              <a-col :key="item.field" :span="8">
                <a-form-item :label="item.name">
                  <a-input v-model="filter[item.field]" placeholder="请输入" />
                </a-form-item>
              </a-col>
            </template>
          </a-row>
          <a-row>
            <a-col
              :span="24"
              :style="{ textAlign: 'right', paddingRight: '2rem' }"
            >
              <a-button icon="search" type="primary" html-type="submit">
                查询
              </a-button>
              <a-button
                icon="undo"
                :style="{ marginLeft: '8px' }"
                @click="handleReset"
              >
                重置
              </a-button>
              <a-upload
                :style="{ marginLeft: '8px' }"
                name="file"
                :file-list="fileList"
                :customRequest="uploadFile"
                :beforeUpload="beforeUpload"
              >
                <a-button> <a-icon type="upload" /> 上传</a-button>
              </a-upload>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="edit">
        <a-row>
          <a-col :span="24">
            <a-button-group>
              <a-button type="primary" icon="redo" @click="refresh">
                刷新
              </a-button>
              <a-button
                type="danger"
                icon="edit"
                :disabled="selectCount > 0 ? false : true"
                @click="delSelect"
              >
                删除
              </a-button>
            </a-button-group>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="table">
      <a-table
        :columns="tablecolumns"
        :data-source="data"
        :scroll="{ x: 1500, y: 575 }"
        bordered
        :pagination="pagination"
        :loading="loading"
        :rowKey="
          (record, index) => {
            return record.id
          }
        "
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          columnWidth: '2%'
        }"
        @change="onChange"
      >
        <template slot="action" slot-scope="text, record">
          <a-button
            type="primary"
            ghost
            size="small"
            @click="handleDetail(record)"
          >
            查看
          </a-button>
          <a-button
            type="primary"
            ghost
            size="small"
            @click="handleEdit(record)"
          >
            编辑
          </a-button>
          <a-button type="primary" ghost size="small" @click="download(record)">
            下载
          </a-button>
          <a-button type="primary" ghost size="small" @click="print(record)">
            
            打印
          </a-button>
          <a-button type="danger" ghost size="small" @click="handleDel(record)">
            删除
          </a-button>
        </template>
      </a-table>
    </div>
    <!-- 输入关键字的弹框  -->
    <a-modal
      title="Title"
      dialogClass="modal"
      :visible="visible"
      width="45%"
      :maskClosable="false"
      centered
      :destroyOnClose="true"
      :closable="false"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template slot="footer">
        <a-button key="back" @click="handleCancel"> 取消 </a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="handleOk"
        >
          确认
        </a-button>
      </template>
      <a-form
        layout="inline"
        class="ant-advanced-search-form"
        :form="form"
        @submit="handleOk"
      >
        <a-row :gutter="48">
          <a-col key="keyword" :span="12">
            <a-form-item label="关键字">
              <a-input
                v-decorator="[
                  'keyword',
                  {
                    rules: [
                      {
                        required: false
                      }
                    ]
                  }
                ]"
                placeholder="请输入关键字"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <div ref="print" id="print" style="width: 100vw; display: none">
      <iframe
        id="iframe"
        :src="Src"
        width="100%"
        height="100%"
        frameborder="0"
        scrolling="auto"
      >
      </iframe>
    </div>
  </div>
</template>
<script>
// 引入接口
import { crud } from '@/request/api'
// antd的弹框
import { Modal } from 'ant-design-vue'
// 
import Print from 'vue-print-nb'
export default {
  name: 'Data',
  data() {
    return {
      // 拼接 后台返回的链接 baseurl
      url: process.env.VUE_APP_BASE_API,
      // iframe嵌套的网页的src
      Src: '',
      // 选中的列表的集合
      selectedRowKeys: [],
      // 顶部搜索的字段列表
      searchcolumns: [
        {
          name: '名字',
          field: 'name'
        },
        {
          name: '关键字',
          field: 'keyword'
        },
        {
          name: '类型',
          field: 'type'
        }
      ],
      // 表格字段列表
      tablecolumns: [
        {
          dataIndex: 'id',
          title: 'id',
          ellipsis: true,
          key: 'id',
          width: '5%'
        },
        {
          dataIndex: 'name',
          title: '名字',
          ellipsis: true,
          key: 'name',
          width: '10%'
        },
        {
          dataIndex: 'type',
          title: '类型',
          ellipsis: true,
          key: 'type',
          width: '10%'
        },
        {
          dataIndex: 'size',
          title: '大小',
          ellipsis: true,
          key: 'size',
          width: '10%'
        },
        {
          dataIndex: 'keyword',
          title: '关键字',
          ellipsis: true,
          key: 'keyword',
          width: '10%'
        },
        {
          dataIndex: 'action',
          title: '操作',
          ellipsis: true,
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: '15%'
        }
      ],
      // 表格的数据
      data: [],
      // 表格搜素筛选的字段
      filter: {},
      // 表格的分页和排序条件
      // 表格的分页数据
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      // 表格排序的字段
      sort: {
        // 字段名
        field: '',
        // 排序条件
        condition: ''
      }, // 表格的数据是否正在加载中
      loading: false,
      // 当前的文件对象
      currentfile: {},
      // 文件上传列表
      fileList: [],
      //  搜索的表格
      formsearch: this.$form.createForm(this, { name: 'advanced_search' }),
      // 关键字录入的弹框
      visible: false,
      // 关键字录入时 确认弹框的正在加载中的显示与否
      confirmLoading: false,
      // 关键字form
      form: this.$form.createForm(this, { name: 'advanced_dialog' })
    }
  },
  computed: {
    selectCount() {
      return this.selectedRowKeys.length
    }
  },
  created() {
    this.getTable()
  },
  mounted() {},
  methods: {
    // 当选中的列表发生变化的时候
    onSelectChange(selectedRowKeys, selectedRows) {
      // console.log(selectedRowKeys, selectedRows)
      // 将选中的表格数据的id 存入selectedRowkeys 注意放入id主要是table的row = record.id
      this.selectedRowKeys = selectedRowKeys
    },
    // 获取表格数据
    getTable() {
      this.loading = true
      var that = this
      that.table = []
      // 查询的条件
      // 分页条件
      var Pagination = {}
      // 排序条件
      var sort = {}
      if (this.pagination.current) {
        Pagination.index = this.pagination.current
        Pagination.size = this.pagination.pageSize
      }
      if (this.sort.field != '') {
        sort = this.sort
      }
      // 筛选条件
      var filter = {}
      for (const i in this.filter) {
        if (this.filter[i]) {
          filter[i] = this.filter[i]
        }
      }
      // console.log(Pagination, sort, this.filter)
      var obj = {
        ...Pagination,
        ...sort,
        ...filter
      }
      // console.log({})
      crud.Search(obj).then((res) => {
        // console.log(res)
        if (res.code != 200) {
          return false
        }
        setTimeout(() => {
          this.loading = false
        }, 200)
        this.data = res.data
        this.pagination.total = res.total
      })
    },
    // 点击搜索
    handleSearch(e) {
      e.preventDefault()
      this.getTable()
    },
    // 点击重置 搜索条件
    handleReset() {
      this.formsearch.resetFields()
    },
    // 刷新表格
    refresh() {
      this.getTable()
    },
    // 当表格的 分页排序条件发生变化的时候
    onChange(pagination, filters, sort) {
      if (sort.column) {
        this.sort.field = sort.column.tableField
        this.sort.condition = sort.order == 'ascend' ? 'ASC' : 'DESC'
      }
      this.pagination = JSON.parse(JSON.stringify(pagination))
      // console.log(this.pagination)
      this.getTable()
    },
    // 上传文件之前的操作
    beforeUpload(file, fileList) {
      console.log(file)
      // return false
    },
    // 上传文件
    uploadFile(file) {
      console.log(file.file)
      var formData = new FormData()
      formData.append('file', file.file)
      // console.log(formData)
      crud.Upload(formData).then((res) => {
        console.log(res)
        this.visible = true
        this.currentfile = {
          ...res.data
        }
      })
    },
    // 表格的查看 编辑 删除按钮
    handleDetail(obj) {
      // console.log(obj)
      crud.DetailHtml({ id: obj.id }).then((res) => {
        var html = this.url + res
        window.open(html)
      })
    },
    // 表格的编辑
    handleEdit(obj) {
      crud.Detail({ id: obj.id }).then((res) => {
        this.visible = true
        // console.log(obj)
        // console.log(res)
        this.$nextTick(() => {
          this.form.setFieldsValue({
            keyword: res.data.keyword
          })
        })
      })
    },
    // 下载文件
    download(record) {
      // console.log(record.type)
      var type = record.type.indexOf('doc')!=-1?'application/msword':'application/vnd.ms-excel'
      // console.log(type)
      crud.DownLoad({ id: record.id }).then((res) => {
        // console.log(res)
        const blob = new Blob([res], { type: type }) // res就是接口返回的文件流了
        const objectUrl = URL.createObjectURL(blob)
        window.location.href = objectUrl
      })
    },
    // 打印文件
    print(obj) {
      var that = this
      console.log(this.url)
      crud.DetailHtml({ id: obj.id }).then((res) => {
        var html = this.url + res
        this.Src = html
        console.log(this.Src)
        setTimeout(() => {
          // Print(this.$refs.print)
          // console.log(Print)
          document.body.innerHTML = this.$refs.print.innerHTML
          // console.log()
          // var iframe = document.getElementById('iframe')
          // window.print()
            const oIframe = document.getElementById('iframe');
    const deviceWidth = document.documentElement.clientWidth;
    const deviceHeight = document.documentElement.clientHeight;
    oIframe.style.width = (Number(deviceWidth)) + 'px'; //数字是页面布局宽度差值
    oIframe.style.height = (Number(deviceHeight)) + 'px'; //数字是页面布局高度差

          //  iframe.onload = function () {
          //     console.log(iframe.contentWindow.document.body.innerHTML)
          //  }
          // var myWindow = window.open(html,'_blank')
	        // myWindow.focus();
          // myWindow.print()
          // iframe.contentWindow.focus()
          // iframe.contentWindow.print()
        }, 1000)
      })
    },
    // 批量删除
    delSelect() {
      // console.log(this.selectedRowKeys)
      var that = this
      Modal.confirm({
        title: '提示',
        centered: true,
        content: '是否删除当前选中的数据?',
        closable: true,
        okText: '确认',
        okButtonProps: {
          props: {
            type: 'default'
          }
        },
        cancelText: '取消',
        cancelButtonProps: {
          props: {
            type: 'primary'
          }
        },
        onOk() {
          var arr = that.selectedRowKeys
          that.delfn(arr)
        },
        onCancel() {
          // console.log('cancel')
        }
      })
    },
    delfn(arr) {
      crud.Delete({ ids: arr.join(',') }).then((res) => {
        // console.log(res)
        if (res.code != 200) {
          return false
        }
        if (this.pagination.current != 1) {
          var nowPage = this.pagination.current * this.pagination.pageSize + 1
          if ((this.pagination.total = nowPage)) {
            this.pagination.current--
          }
        }
        // 删除完成之后将选中的列表清空
        this.selectedRowKeys = []
        this.getTable()
      })
    },
    handleDel(obj) {
      var that = this
      Modal.confirm({
        title: '提示',
        centered: true,
        content: '是否删除当前选中的数据?',
        closable: true,
        okText: '确认',
        okButtonProps: {
          props: {
            type: 'default'
          }
        },
        cancelText: '取消',
        cancelButtonProps: {
          props: {
            type: 'primary'
          }
        },
        onOk() {
          var arr = [obj.id]
          that.delfn(arr)
        },
        onCancel() {
          // console.log('cancel')
        }
      })
    },
    // 关键字弹框的 取消确认按钮
    handleCancel() {
      this.currentfile = {}
      this.visible = false
      this.getTable()
    },
    handleOk(e) {
      e.preventDefault()
      this.confirmLoading = true
      this.form.validateFields((error, values) => {
        if (error) {
          console.log(error)
        }
        // console.log(values)
        var obj = {
          ...this.currentfile,
          ...values
        }
        crud.Update(obj).then((res) => {
          // console.log(res)
          if (res.code != 200) {
            return false
          }
          this.visible = false
          this.currentfile = {}
          this.getTable()
        })
      })
    }
  }
}
</script>
<style scoped lang="scss">
.data-bank {
  .header {
    .search {
      /deep/ .ant-advanced-search-form {
        .ant-form-item {
          display: flex;
        }
        .ant-form-item-control-wrapper {
          flex: 1;
        }
      }
    }
  }
}
/deep/.modal {
  .ant-form-inline .ant-form-item {
    width: 100%;
    display: flex;
    .ant-form-item-control-wrapper {
      flex: 1;
    }
  }
}
.table {
  .ant-table-bordered .ant-table-tbody > tr > td {
    .ant-btn {
      margin-right: 0.5rem;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
