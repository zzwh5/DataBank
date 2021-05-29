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
            <a-col :span="8" style="position: relative; top: -10px">
              <a-button icon="search" type="primary" html-type="submit">
                查询
              </a-button>
              <a-button style="margin-left: 2%" @click="uploadFilebtn">
                <a-icon type="user-add" /> 新增</a-button
              >
            </a-col>
          </a-row>
          <a-row />
        </a-form>
      </div>
      <div class="edit">
        <a-row>
          <a-col :span="24">
            <a-button-group style="width: 100%">
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
            <!-- <span style="margin-left: 20px; opacity: 0.7"
              >当前仅支持xlsx、xls、docx、doc(不支持二维码)!</span
            > -->
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="table" style="margin-top: 1%">
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
        <template slot="size" slot-scope="text">
          <span>{{ text }}字节</span>
        </template>
        <template slot="action" slot-scope="text, record">
          <!-- <a-button
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
          </a-button> -->
          <a-button
            type="danger"
            ghost
            size="small"
            @click="del_single(record)"
          >
            删除
          </a-button>
        </template>
      </a-table>
    </div>
    <!-- 输入关键字的弹框  -->
    <a-modal
      :title="Title"
      dialogClass="modal"
      :visible="visible"
      width="35%"
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
          :loading="confirmLoading"
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
            <a-form-item label="用户名">
              <a-input
                v-decorator="[
                  'username',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入用户名'
                      }
                    ]
                  }
                ]"
                :disabled="Title == '查看用户' ? true : false"
                placeholder="请输入用户名"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col key="keyword" :span="12">
            <a-form-item label="密码">
              <a-input
                v-decorator="[
                  'password',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码'
                      }
                    ]
                  }
                ]"
                :disabled="Title == '查看用户' ? true : false"
                placeholder="请输入密码"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <!-- 正在加载中  -->
    <Loading :visible="visible1" :text="text" />
  </div>
</template>
<script>
import { message } from 'ant-design-vue'
// 正在加载中的组件
import Loading from '@/components/loading.vue'
// 引入接口
import { get, put, deletefn, post } from '@/request/http'
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
      // 当前编辑的id
      ids: null,
      // 编辑和新增的弹框名称
      Title: '新增用户',
      // 判断是新增还是编辑
      types: false,
      // 查看文件的弹框是否展示
      visibleSee: false,
      // 预览文件的 链接
      showwordsrc: 'https://view.officeapps.live.com/op/view.aspx?src=',
      // 正在加载中
      visible1: false,
      text: '加载中',
      // 选中的列表的集合
      selectedRowKeys: [],
      // 顶部搜索的字段列表
      searchcolumns: [
        {
          name: '用户名',
          field: 'username'
        }
      ],
      // 表格字段列表
      tablecolumns: [
        {
          dataIndex: 'id',
          title: '用户id',
          ellipsis: true,
          key: 'id',
          width: '5%'
        },
        {
          dataIndex: 'username',
          title: '用户名',
          ellipsis: true,
          key: 'name',
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
      get('user', obj)
        .then((res) => {
          this.visible1 = false
          // console.log(res)
          if (res.code != 200) {
            message.error('系统异常请稍后重试')
            return false
          }
          setTimeout(() => {
            that.loading = false
          }, 200)
          this.data = res.data
          this.pagination.total = res.total
        })
        .catch((err) => {
          console.log(err)
          this.visible1 = false
          setTimeout(() => {
            // message.error('系统异常请稍后')
            that.loading = false
          }, 200)
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

    // 点击上传按钮之前的操作
    uploadFilebtn() {
      this.visible = true
      this.Title = '新增用户'
      this.types = true
    },

    // 表格的查看 编辑 删除按钮
    handleDetail(obj, type) {
      this.ids = obj.id
      if (!type) {
        this.Title = '查看用户'
      }
      // return false
      this.text = '加载中'
      this.visible1 = true
      // console.log(obj)
      get('user/findById', { id: obj.id }).then((res) => {
        this.visible1 = false
        if (res.code != 200) {
          message.error('系统异常，请稍后重试')
          return false
        }
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue({
            username: res.data.username,
            password: res.data.password
          })
        })
      })
    },
    // 表格的编辑
    handleEdit(obj) {
      this.types = false
      this.Title = '编辑用户'
      this.handleDetail(obj, 'edit')
    },
    // 单个删除
    del_single(obj) {
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
          const arr = []
          arr.push(obj.id)
          console.log(arr)
          that.delfn(arr)
        },
        onCancel() {
          // console.log('cancel')
        }
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
    // 删除
    delfn(arr) {
      var that = this
      deletefn('user', { ids: arr.join(',') })
        .then((res) => {
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
        .catch((err) => {
          // console.log(err)
          this.visible1 = false
          setTimeout(() => {
            // message.error('系统异常请稍后')
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
      this.visible = false
      this.visible1 = false
    },
    handleOk(e) {
      var that = this
      if (this.confirmLoading) {
        return false
      }
      // var that = this
      e.preventDefault()

      this.form.validateFields((error, values) => {
        if (error) {
          console.log(error)
        }
        if (!values.password) {
          message.error('请输入密码')
          return false
        }
        if (!values.username) {
          message.error('请输入用户名')
          return false
        }
        this.confirmLoading = true
        this.visible1 = true
        let data = values
        if (this.types) {
          this.text = '加载中'
        } else {
          this.text = '编辑中'
          // console.log(values)
          data = {
            id: this.ids,
            ...values
          }
        }
        // console.log(data)
        // return false
        put('user', data)
          .then((res) => {
            this.confirmLoading = false
            this.visible1 = false
            if (res.code != 200) {
              message.error(res.message || '系统异常请稍后重试')
              return false
            }
            console.log(res)
            this.visible = false
            setTimeout(() => {
              that.getTable()
            }, 100)
          })
          .catch((err) => {
            console.log(err)
            this.visible1 = false
            this.confirmLoading = false
            setTimeout(() => {
              // message.error('系统异常请稍后')
            }, 200)
          })
      })
    }
  }
}
</script>
<style scoped lang="scss">
/deep/.ant-modal.preview {
  .ant-modal-content {
    width: 100%;
    height: 100%;
    .ant-modal-body {
      width: 100%;
      height: 100%;
      padding: 40px !important;
      #print {
        height: 100%;
      }
    }
  }
}
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
    .ant-form-item-label {
      width: 5em;
    }
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
