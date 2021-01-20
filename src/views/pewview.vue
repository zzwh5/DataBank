<template>
  <div class="data-bank">
    测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试
    <!-- 查看的弹框 -->
    <div id="print">
      <!-- <img :src="Src" alt="" /> -->
      <iframe
        id="printIframe"
        width="100%"
        height="100%"
        :src="showwordsrc + Src"
        frameborder="1"
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
    // Loading
  },
  data() {
    return {
      // 当前编辑的id
      ids: null,
      // 编辑和新增的弹框名称
      Title: '上传文件',
      // 判断是新增还是编辑
      types: false,
      // 查看文件的弹框是否展示
      visibleSee: true,
      // 预览文件的 链接
      showwordsrc: 'https://view.officeapps.live.com/op/view.aspx?src=',
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
          name: '文件名称',
          field: 'name'
        },
        {
          name: '搜索关键字',
          field: 'keyword'
        }
      ],
      // 表格字段列表
      tablecolumns: [
        {
          dataIndex: 'id',
          title: '文件编码',
          ellipsis: true,
          key: 'id',
          width: '5%'
        },
        {
          dataIndex: 'name',
          title: '文件名称',
          ellipsis: true,
          key: 'name',
          width: '10%'
        },
        {
          dataIndex: 'type',
          title: '文件类型',
          ellipsis: true,
          key: 'type',
          width: '5%'
        },
        {
          dataIndex: 'size',
          title: '文件大小',
          ellipsis: true,
          key: 'size',
          width: '8%',
          scopedSlots: { customRender: 'size' }
        },
        {
          dataIndex: 'keyword',
          title: '搜索关键字',
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
  mounted() {
    console.log(this.$route.query.id)
    crud
      .Detail({ id: this.$route.query.id })
      .then((res) => {
        console.log(res)
        this.visible1 = false
        if (res.code != 200) {
          message.error('系统异常请稍后重试')
          return false
        }
        var html = this.url + res.data.uri + res.data.type
        console.log(html)
        // window.open(html)
        this.Src = html
      })
      .catch((err) => {
        console.log(err)
        this.visible1 = false
      })
  },
  methods: {
    diaolog_see_close() {
      this.visibleSee = false
      this.Src = ''
    },
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
      crud
        .Search(obj)
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
            message.error('系统异常请稍后')
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
    // 上传文件之前的操作
    beforeUpload(file, fileList) {
      // console.log(file)
      var type = ['docx', 'xlsx', 'xls']
      // console.log(type.indexOf(file.name.split('.')[1]))
      var arr = file.name.split('.')
      console.log(type.indexOf(arr[arr.length - 1]))
      if (type.indexOf(arr[arr.length - 1]) == -1) {
        message.error('选择正确的文件格式')
        return false
      }
      if (file.size > 1024 * 1024 * 5) {
        message.error('选择的文件不能大于5M')
        return false
      }
    },
    // 点击上传按钮之前的操作
    uploadFilebtn() {
      this.visible = true
      this.Title = '上传文件'
      this.types = true
    },
    // 上传文件
    uploadFile(file) {
      // console.log(file.file)
      this.fileList = [file.file]
    },
    // 表格的查看 编辑 删除按钮
    handleDetail(obj) {
      this.visibleSee = true
      // return false
      this.text = '加载中'
      this.visible1 = true
      // console.log(obj)
      crud
        .Detail({ id: obj.id })
        .then((res) => {
          console.log(res)
          this.visible1 = false
          if (res.code != 200) {
            message.error('系统异常请稍后重试')
            return false
          }
          var html = this.url + res.data.uri + res.data.type
          console.log(html)
          // window.open(html)
          this.Src = html
        })
        .catch((err) => {
          console.log(err)
          this.visible1 = false
        })
    },
    // 表格的编辑
    handleEdit(obj) {
      this.types = false
      crud.Detail({ id: obj.id }).then((res) => {
        this.Title = '修改关键字'
        this.visible = true
        this.ids = res.data.id
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
      console.log(record)
      this.visible1 = true
      this.text = '下载中'
      // console.log(record.type)
      // var type =
      //   record.type.indexOf('doc') != -1
      //     ? 'application/msword'
      //     : 'application/vnd.ms-excel'

      crud
        .Detail({ id: record.id })
        .then((res) => {
          console.log(res)
          // if (res.code != 200) {
          //   message.error('下载失败请重试')
          //   return false
          // }
          this.visible1 = false
          // console.log(res)
          window.location.href = res.data.downUrl
        })
        .catch((err) => {
          console.log(err)
          this.visible1 = false
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
        crud
          .DownLoad({ id: obj.id })
          .then((re) => {
            // console.log(re)
            this.visible1 = false
            var html = this.url + res.data
            console.log(html)
            this.Src = html
            setTimeout(() => {
              // document.body.innerHTML = document.getElementById('print').innerHTML
            }, 1000)
            setTimeout(() => {
              $('iframe')[0].contentWindow.print()
              // location.reload()
            }, 2000)
          })
          .catch((err) => {
            console.log(err)
            this.visible1 = false
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
      this.currentfile = {}
      this.visible = false
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

        var formData = new FormData()
        if (this.fileList.length < 1 && this.types) {
          message.error('请选择上传文件')
          return false
        }
        this.confirmLoading = true
        this.visible1 = true
        if (this.types) {
          this.text = '上传中'
          formData.append('file', this.fileList[0])
          if (values.keyword) {
            formData.append('keyword', values.keyword)
          } else {
            formData.append('keyword', '')
          }
          crud
            .Upload(formData)
            .then((res) => {
              this.confirmLoading = false
              this.visible1 = false
              if (res.code != 200) {
                message.error(res.message || '系统异常请稍后重试')
                return false
              }
              console.log(res)
              this.visible = false
              message.success('上传成功')
              this.fileList = []
              setTimeout(() => {
                that.getTable()
              }, 100)
            })
            .catch((err) => {
              console.log(err)
              this.visible1 = false
              this.confirmLoading = false
            })
        } else {
          this.text = '编辑中'
          // console.log(values)
          const obj = {
            id: this.ids,
            ...values
          }
          // console.log(obj)
          crud
            .Update(obj)
            .then((res) => {
              console.log(res)
              this.visible1 = false
              if (res.code != 200) {
                message.error('系统异常请稍后重试')
                return false
              }
              message.success('修改成功')
              this.visible = false
              this.form.setFieldsValue({
                keyword: ''
              })
              this.fileList = []
              setTimeout(() => {
                that.getTable()
              }, 100)
            })
            .catch((err) => {
              console.log(err)
              this.visible1 = false
            })
        }
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
  width: 100vw !important;
  height: 100vh !important;
  background: #fff;
  #print {
    // width: 100%;
    width: 1024px;
    height: 100%;
  }
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
