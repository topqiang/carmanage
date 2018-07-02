<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" >
				<el-form-item label="资讯标题">
					<el-input v-model="filters.name" placeholder="请输入关键词"></el-input>
				</el-form-item>
                <el-form-item>
					<el-button type="primary" v-on:click="filterUsers">查询</el-button>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item> -->
			</el-form>
		</el-col>

		<!--列表-->
		<el-table 
			:data="users" 
			highlight-current-row 
			v-loading="listLoading" 
            :page-size="pageSize"
            :current-page="pageIndex"
            :total="total"
            layout="total, prev, pager, next, jumper"
			style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
            <el-table-column prop="id" label="ID" width="80" sortable>
			</el-table-column>
            <el-table-column prop="title" label="标题" width="120" sortable>
			</el-table-column>
            <el-table-column prop="sketch" label="简介" width="120" sortable>
			</el-table-column>
			<el-table-column prop="author" label="作者" width="100" sortable>
			</el-table-column>
			<el-table-column prop="clicknum" label="点赞数" width="100" sortable>
			</el-table-column>
			<el-table-column prop="readnum" label="阅读数" width="100" sortable>
			</el-table-column>
			<el-table-column prop="ctime" label="创建时间" width="120" sortable>
			</el-table-column>
            <el-table-column prop="utime" label="修改时间" min-width="180" sortable>
			</el-table-column>
            <el-table-column prop="status" label="状态" min-width="180" :formatter="formatStatus" sortable>
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template scope="scope">
					<!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
                    <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
                    <el-button type="danger" size="small" @click="handleDetail(scope.$id, scope.row)">查看详细信息</el-button>
				</template>
			</el-table-column>
		</el-table>

	</section>
</template>

<script>
import util from '../../common/js/util'
import NProgress from 'nprogress'
import moment from 'moment'
moment().format()
import { requestCommon, ERR_OK } from '@/api/api.js'
export default {
  data() {
    return {
      //列表
      filters: {
        name: ''
      },
      dateEnd: '',
      rules: {},
      users: [],
      total: 10, //总页数
      pageIndex: 1, //当前页
      pageSize: 10, //每页条数
      listLoading: false, //加载状态
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      }
    }
  },
  methods: {
    //获取数据函数组
    //改变并返回响应数据结构
    _normalizeUserData(data) {
      let ret = []
      data.forEach((val, index) => {
        let row = {}
        row.id = val.id
        row.title = val.title
        row.sketch = val.sketch
        row.author = val.author
        row.clicknum = val.clicknum
        row.readnum = val.readnum
        row.ctime = val.ctime
        row.utime = val.utime
        row.status = val.status
        ret.push(row)
      })
      return ret
    },
    //改变表格状态显示
    formatStatus(row) {
      return row.status === 1 ? '状态正常' : '异常状态'
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getUsers(this.pageIndex, '', this.pageSize)
    },
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getUsers(this.pageIndex, '', this.pageSize)
    },
    //获取加盟商列表
    getUsers(page, pageSize, searchText, pop) {
      let url = 'api/carmation/selectMation.html'
      let para = {
        pagenum: page, //当前页数
        listNum: pageSize, //查询条数
        searchText: searchText ? searchText : '' //搜索数据
      }
      this.listLoading = true //加载中
      NProgress.start() //进度条
      requestCommon(url, para, 'post').then(res => {
        if (res.code === ERR_OK) {
          this.users = this._normalizeUserData(res.data)
          if (pop !== undefined) {
            this.$notify({
              title: '成功',
              message: res.message,
              position: 'top-left'
            })
          }
        } else {
          this.$notify({
            title: '失败',
            message: '列表获取失败',
            position: 'top-left'
          })
        }
        this.listLoading = false
        NProgress.done()
      })
    },
    //查询加盟商列表
    filterUsers() {
      let sel = this.filters.name
      this.getUsers(this.pageIndex, this.pageSize, sel, true)
    },
    // 用户功能模块函数组
    // 查看加盟商详情
    handleDetail(id, row) {
      console.log(id, row)
    },
    //删除加盟商信息
    handleDel: function(row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.listLoading = true
          NProgress.start()
          let url = 'api/carmation/deletMation.html'
          let para = { id: row.id }
          requestCommon(url, para)
            .then(res => {
              if (res.code === ERR_OK) {
                this.listLoading = false
                NProgress.done()
                this.$notify({
                  title: '成功',
                  message: res.message,
                  type: 'success'
                })
                this.getUsers(this.pageIndex, this.pageSize)
              } else {
                this.$notify({
                  title: '失败',
                  message: res.message,
                  type: 'success'
                })
              }
            })
            .catch(e => {
              this.$notify({
                title: '失败',
                message: '删除失败',
                type: 'success'
              })
            })
        })
        .catch(() => {})
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true
      this.addForm = {
        name: '',
        sex: -1,
        age: 0,
        birth: '',
        addr: ''
      }
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            NProgress.start()
            let para = Object.assign({}, this.editForm)
            para.birth =
              !para.birth || para.birth == ''
                ? ''
                : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd')
            editUser(para).then(res => {
              this.editLoading = false
              NProgress.done()
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getUsers()
            })
          })
        }
      })
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            NProgress.start()
            let para = Object.assign({}, this.addForm)
            para.birth =
              !para.birth || para.birth == ''
                ? ''
                : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd')
            addUser(para).then(res => {
              this.addLoading = false
              NProgress.done()
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getUsers()
            })
          })
        }
      })
    },
    selsChange: function(sels) {
      this.sels = sels
    },
    //批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.id).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.listLoading = true
          NProgress.start()
          let para = { ids: ids }
          batchRemoveUser(para).then(res => {
            this.listLoading = false
            NProgress.done()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
            this.getUsers()
          })
        })
        .catch(() => {})
    }
  },
  mounted() {
    this.getUsers(this.pageIndex, this.pageSize)
  }
}
</script>

<style scoped>
</style>