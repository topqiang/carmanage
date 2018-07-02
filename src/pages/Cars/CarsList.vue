<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" >
				<el-form-item label="加盟商名称" required>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
                <el-form-item label="起止时间" required>
                    <el-col :span="11">
                        <el-date-picker
                            v-model="filters.dateStart"
                            type="date"
                            placeholder="选择日期"
                            style="width: 100%;">
                        </el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-date-picker 
                            type="date"
                            placeholder="选择结束日期"
                            v-model="filters.dateEnd"
                            style="width: 100%;">
                        </el-date-picker>
                    </el-col>
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
            <el-table-column prop="a_id" label="ID" width="80" sortable>
			</el-table-column>
            <el-table-column prop="name" label="名称" width="120" sortable>
			</el-table-column>
            <el-table-column prop="account" label="账号" width="120" sortable>
			</el-table-column>
			<el-table-column prop="contactnum" label="电话" width="120" sortable>
			</el-table-column>
			<el-table-column prop="province" label="省份" width="100" sortable>
			</el-table-column>
			<el-table-column prop="city" label="城市" width="100" sortable>
			</el-table-column>
			<el-table-column prop="area" label="区域" width="100" sortable>
			</el-table-column>
			<el-table-column prop="legal_person" label="法人姓名" width="120" sortable>
			</el-table-column>
            <el-table-column prop="id_number" label="身份证号" min-width="180" sortable>
			</el-table-column>
            <el-table-column prop="ip" label="最后登录ip" min-width="180" sortable>
			</el-table-column>
            <el-table-column prop="time" label="最后登录时间" min-width="180" sortable>
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
        name: '',
        dateStart: '',
        dateEnd: ''
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
      },
      //编辑界面数据
      editForm: {
        id: 0,
        name: '',
        sex: -1,
        age: 0,
        birth: '',
        addr: ''
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      },
      //新增界面数据
      addForm: {
        name: '',
        sex: -1,
        age: 0,
        birth: '',
        addr: ''
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
        row.a_id = val.a_id
        row.name = val.name
        row.account = val.account
        row.contactnum = val.contactnum
        row.province = val.province
        row.city = val.city
        row.area = val.area
        row.legal_person = val.legal_person
        row.id_number = val.id_number
        row.last_login_time = val.last_login_time
        row.last_login_ip = val.last_login_ip
        ret.push(row)
      })
      return ret
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
    getUsers(page, pageSize, pop, stat, start, end, aname) {
      let url = 'api/cash/selectCash'
      let para = {
        pagenum: page, //当前页数
        listNum: pageSize, //查询条数
        status: stat ? stat : '', //状态
        start_time: start ? start : '',
        end_time: end ? end : '',
        name: aname ? aname : ''
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
    //查询加盟商列表
    filterUsers() {
      let stat = '',
        start = moment(this.filters.dateStart).format('YYYY-MM-DD'),
        // end = moment(this.filters.dateEnd).format('YYYY-MM-DD'),
        name = this.filters.name,
        end = ''
      this.getUsers(this.pageIndex, this.pageSize, true, stat, start, end, name)
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
          let url = 'api/cash/deletCash'
          let para = { a_id: row.a_id }
          console.log(para)
          requestCommon(url, para)
            .then(res => {
              console.log(res)
              this.listLoading = false
              NProgress.done()
              this.$notify({
                title: '成功',
                message: res.message,
                type: 'success'
              })
            })
            .catch(e => {
              this.$notify({
                title: '成功',
                message: res.message,
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