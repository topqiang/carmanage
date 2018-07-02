<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
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
            <el-table-column prop="id" label="ID" width="120" sortable>
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
			</el-table-column>
			<el-table-column prop="nickName" label="微信名" width="100" sortable>
			</el-table-column>
			<el-table-column prop="phone" label="手机号" width="120" sortable>
			</el-table-column>
			<el-table-column prop="ip" label="最后登录ip" min-width="180" sortable>
			</el-table-column>
            <el-table-column prop="time" label="最后登录时间" min-width="180" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
                    <el-button type="danger" size="small" @click="handleDetail(scope.$id, scope.row)">查看详细信息</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<!-- <el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col> -->

		<!--编辑界面-->
		<!-- <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog> -->

		<!--新增界面-->
		<!-- <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog> -->
	</section>
</template>

<script>
import util from '../../common/js/util'
import NProgress from 'nprogress'
import { requestCommon, ERR_OK } from '@/api/api.js'

export default {
  data() {
    return {
      //列表
      filters: {
        name: ''
      },
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
    //改变并返回响应数据结构
    _normalizeUserData(data) {
      console.log(data)
      let ret = []
      data.forEach((val, index) => {
        let row = {}
        row.id = val.u_id
        row.name = val.name
        row.sex = val.sex
        row.nickName = val.nickName
        row.phone = val.phone
        row.ip = val.last_login_ip
        row.time = val.last_login_time
        ret.push(row)
      })
      return ret
    },
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知'
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getUsers(this.pageIndex, '', this.pageSize)
    },
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getUsers(this.pageIndex, '', this.pageSize)
    },
    //获取用户列表
    getUsers(page, name, pageSize, pop) {
      let url = 'api/user/selectUser'
      let para = {
        pagenum: page, //当前页数
        nickName: name, //用户微信昵称
        listNum: pageSize //查询条数
      }
      this.listLoading = true //加载中
      NProgress.start() //进度条
      requestCommon(url, para, 'post').then(res => {
        if (res.code === ERR_OK) {
          this.users = this._normalizeUserData(res.data)
          if (pop !== undefined) {
            this.$notify({
              title: '提示',
              message: res.message,
              position: 'top-left'
            })
          }
        } else {
          this.$notify({
            title: '提示',
            message: '列表请求失败！',
            position: 'top-left'
          })
        }
        this.listLoading = false
        NProgress.done()
      })
    },
    //查询用户列表
    filterUsers() {
      this.getUsers(this.pageIndex, this.filters.name, this.pageSize, true)
    },
    // 用户功能模块函数组
    // 查看用户详情
    handleDetail(id, row) {
      console.log(id, row)
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.listLoading = true
          NProgress.start()
          let para = { id: row.id }
          removeUser(para).then(res => {
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
    this.getUsers(this.pageIndex, '', this.pageSize)
  }
}
</script>

<style scoped>
</style>