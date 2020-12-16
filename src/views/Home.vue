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
    <!-- zhnegzia  -->
    <Loading :visible="visible1" :text="text" />
    <div id="print" style="display: none; width: '100%'; height: '100%'">
      <!-- <img :src="Src" alt="" /> -->
      <iframe
        id="printIframe"
        width="100%"
        height="100%"
        :src="Src"
        frameborder="0"
      >
      </iframe>
    </div>
  </div>
</template>
<script>
import { message } from 'ant-design-vue'
import $ from 'jquery'
// 正在加载中的组件
import Loading from '@/components/loading.vue'
// 引入接口
import { crud } from '@/request/api'
// antd的弹框
import { Modal } from 'ant-design-vue'
export default {
  name: 'Data',
  components: {
    Loading
  },
  data() {
    return {
      // 正在加载中
      visible1: false,
      text: '加载中',
      // 拼接 后台返回的链接 baseurl
      url: process.env.VUE_APP_BASE_URL,
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
          width: '3%'
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
          width: '5%'
        },
        {
          dataIndex: 'size',
          title: '大小',
          ellipsis: true,
          key: 'size',
          width: '8%'
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
    var that = this
    // 如果sessionstorage中有状态
    this.pagination = sessionStorage.getItem('pagination')
      ? JSON.parse(sessionStorage.getItem('pagination'))
      : { current: 1, pageSize: 10, total: 0 }
    this.filter = sessionStorage.getItem('filter')
      ? JSON.parse(sessionStorage.getItem('filter'))
      : {}
    this.sort = sessionStorage.getItem('sort')
      ? JSON.parse(sessionStorage.getItem('sort'))
      : {}
    this.selectedRowKeys = sessionStorage.getItem('selectedRowKeys')
      ? JSON.parse(sessionStorage.getItem('selectedRowKeys'))
      : []
    sessionStorage.clear()
    setTimeout(() => {
      that.getTable()
    }, 100)
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
      this.text = '加载中'
      this.visible1 = true
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
        this.visible1 = false
        // console.log(res)
        if (res.code != 200) {
          message.error('系统异常请稍后重试')
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
      var that = this
      setTimeout(() => {
        that.getTable()
      }, 100)
    },
    // 点击重置 搜索条件
    handleReset() {
      this.filter = {}
      var that = this
      setTimeout(() => {
        that.getTable()
      }, 100)
    },
    // 刷新表格
    refresh() {
      var that = this
      setTimeout(() => {
        that.getTable()
      }, 100)
    },
    // 当表格的 分页排序条件发生变化的时候
    onChange(pagination, filters, sort) {
      var that = this
      if (sort.column) {
        this.sort.field = sort.column.tableField
        this.sort.condition = sort.order == 'ascend' ? 'ASC' : 'DESC'
      }
      this.pagination = JSON.parse(JSON.stringify(pagination))
      setTimeout(() => {
        that.getTable()
      }, 200)
      // console.log(this.pagination)
    },
    // 上传文件之前的操作
    beforeUpload(file, fileList) {
      // console.log(file)
      var type = ['doc', 'docx', 'xls', 'xlsx']
      // console.log(type.indexOf(file.name.split('.')[1]))
      var arr = file.name.split('.')
      console.log(type.indexOf(arr[arr.length - 1]))
      if (type.indexOf(arr[arr.length - 1]) == -1) {
        message.error('选择正确的文件格式')
        return false
      }
    },
    // 上传文件
    uploadFile(file) {
      this.visible1 = true
      console.log(file.file)
      var formData = new FormData()
      formData.append('file', file.file)
      // console.log(formData)
      crud.Upload(formData).then((res) => {
        if (res.code != 200) {
          message.error(res.message || '系统异常请稍后重试')
          return false
        }
        console.log(res)
        this.visible = true
        this.visible1 = false
        this.currentfile = {
          ...res.data
        }
      })
    },
    // 表格的查看 编辑 删除按钮
    handleDetail(obj) {
      this.text = '加载中'
      this.visible1 = true
      // console.log(obj)
      crud.DetailHtml({ id: obj.id }).then((res) => {
        this.visible1 = false
        if (res.code != 200) {
          message.error('系统异常请稍后重试')
          return false
        }
        var html = this.url + res.data
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
      this.visible1 = true
      this.text = '下载中'
      // console.log(record.type)
      var type =
        record.type.indexOf('doc') != -1
          ? 'application/msword'
          : 'application/vnd.ms-excel'
      // console.log(type)
      crud.DetailHtml({ id: record.id }).then((res) => {
        console.log(this.visible1)
        this.visible1 = false
        if (res.code != 200) {
          message.error('系统异常请稍后')
          return false
        }
        crud.DownLoad({ id: record.id }).then((res) => {
          // if (res.code != 200) {
          //   message.error('下载失败请重试')
          //   return false
          // }
          this.visible1 = false
          // console.log(res)
          const blob = new Blob([res], { type: type }) // res就是接口返回的文件流了
          const objectUrl = URL.createObjectURL(blob)
          window.location.href = objectUrl
        })
      })
    },
    // 打印文件
    print(obj) {
      // console.log(this.url)
      sessionStorage.setItem(
        'selectedRowKeys',
        JSON.stringify(this.selectedRowKeys)
      )
      sessionStorage.setItem('pagination', JSON.stringify(this.pagination))
      sessionStorage.setItem('filter', JSON.stringify(this.filter))
      sessionStorage.setItem('sort', JSON.stringify(this.sort))
      this.visible1 = true
      this.text = '解析中'
      crud.DetailHtml({ id: obj.id }).then((res) => {
        if (res.code != 200) {
          message.error('系统异常请稍后')
          this.visible1 = false
          return false
        }
        crud.DownLoad({ id: obj.id }).then((re) => {
          // console.log(re)
          this.visible1 = false
          var html = this.url + res.data
          this.Src = html
          setTimeout(() => {
            // document.body.innerHTML = document.getElementById('print').innerHTML
          }, 1000)
          setTimeout(() => {
            $('iframe')[0].contentWindow.print()
            // location.reload()
          }, 2000)
        })
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
      var that = this
      crud.Delete({ ids: arr.join(',') }).then((res) => {
        // console.log(res)
        if (res.code != 200) {
          message.error('删除失败，请稍后重试')
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
        setTimeout(() => {
          that.getTable()
        }, 200)
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
      var that = this
      this.currentfile = {}
      this.visible = false
      setTimeout(() => {
        that.getTable()
      }, 100)
    },
    handleOk(e) {
      var that = this
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
          this.visible = false
          // console.log(res)
          if (res.code != 200) {
            message.error('系统异常请稍后重试')
            return false
          }
          this.currentfile = {}
          setTimeout(() => {
            that.getTable()
          }, 100)
        })
      })
    },
    // 判断当前浏览类型
    BrowserType() {
      var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
      var isOpera = userAgent.indexOf('Opera') > -1 // 判断是否Opera浏览器
      var isIE =
        userAgent.indexOf('compatible') > -1 &&
        userAgent.indexOf('MSIE') > -1 &&
        !isOpera // 判断是否IE浏览器
      var isEdge =
        userAgent.indexOf('Windows NT 6.1; Trident/7.0;') > -1 && !isIE // 判断是否IE的Edge浏览器
      var isFF = userAgent.indexOf('Firefox') > -1 // 判断是否Firefox浏览器
      var isSafari =
        userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') == -1 // 判断是否Safari浏览器
      var isChrome =
        userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1 // 判断Chrome浏览器
      console.log(isIE)
      if (isIE) {
        var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
        reIE.test(userAgent)
        var fIEVersion = parseFloat(RegExp['$1'])
        if (fIEVersion == 7) {
          return 'IE7'
        } else if (fIEVersion == 8) {
          return 'IE8'
        } else if (fIEVersion == 9) {
          return 'IE9'
        } else if (fIEVersion == 10) {
          return 'IE10'
        } else if (fIEVersion == 11) {
          return 'IE11'
        } else {
          return '0'
        } // IE版本过低
      } // isIE end

      if (isFF) {
        return 'FF'
      }
      if (isOpera) {
        return 'Opera'
      }
      if (isSafari) {
        return 'Safari'
      }
      if (isChrome) {
        return 'Chrome'
      }
      if (isEdge) {
        return 'Edge'
      }
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
