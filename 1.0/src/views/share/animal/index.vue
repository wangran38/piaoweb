<template>
  <div class="app-container">
    <div class="filter-container" style="margin:0 0 10px 0;">
      <el-input v-model="listQuery.animal_name" placeholder="动物简称" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.efirstname" placeholder="首字母" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <!--<el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>-->
      <!--<el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>-->
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handle">
        添加
      </el-button>

    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="60"
        :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="pid" width="60">
        <template slot-scope="{row}">
          <span>{{ row.pid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="动物名称" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.animal_name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拼音" min-width="">
        <template slot-scope="{row}">
          <span>{{ row.ename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="首字母" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.efirstname }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="拼音" min-width="">
        <template slot-scope="{row}">
          <span>{{ row.keywords }}</span>
        </template> -->
      </el-table-column>
      <!-- <el-table-column label="code" min-width="50px">
        <template slot-scope="{row}">
<span>{{ row.code }}</span>
        </template>
      </el-table-column>
            <el-table-column label="lat精度" min-width="80px">
        <template slot-scope="{row}">
<span>{{ row.lat }}</span>
        </template>
      </el-table-column>
            <el-table-column label="lng维度" min-width="80px">
        <template slot-scope="{row}">
<span>{{ row.lng }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handle2(row)">
            修改
          </el-button>
          <el-button v-if="row.status != 'published'" size="mini" type="danger" @click="deleteAnimal(row)">
            删除
          </el-button>
          <!--<el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button>-->
          <!--<el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>-->
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      @pagination="getList" />


    <el-dialog :visible.sync="dialogPvVisible" title="添加怪兽">
      <el-form ref="formData" :model="formData">
        <el-form-item label="怪兽名称">
          <el-input v-model="formData.animal_name"></el-input>
        </el-form-item>
        <el-form-item label="怪兽拼音">
          <el-input v-model="formData.ename"></el-input>
        </el-form-item>
        <el-form-item label="怪兽拼音首字母">
          <el-input v-model="formData.efirstname"></el-input>
        </el-form-item>
        <el-form-item label="怪兽图片地址">
          <el-input v-model="formData.image"></el-input>
        </el-form-item>
        <el-form-item label="序号">
          <el-input v-model="formData.haoma"></el-input>
        </el-form-item>
        <el-button type="success" style="width: 100%;" @click="addAnimal">提交</el-button>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogPvVisible2" title="修改怪兽">
      <el-form ref="formData" :model="temporaryFormData">
        <el-form-item label="怪兽名称">
          <el-input v-model="temporaryFormData.animal_name"></el-input>
        </el-form-item>
        <el-form-item label="怪兽拼音">
          <el-input v-model="temporaryFormData.ename"></el-input>
        </el-form-item>
        <el-form-item label="怪兽拼音首字母">
          <el-input v-model="temporaryFormData.efirstname"></el-input>
        </el-form-item>
        <el-form-item label="怪兽图片地址">
          <el-input v-model="temporaryFormData.image"></el-input>
        </el-form-item>
        <el-form-item label="序号">
          <el-input v-model="temporaryFormData.haoma"></el-input>
        </el-form-item>
        <el-button type="success" style="width: 100%;" @click="updateAnimal">修改</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getlist, addData, editData, delData } from '@/api/share/animal'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
  name: '',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      formData: {
        animal_name: '', // 怪兽名称
        ename: '', // 怪兽拼音
        efirstname: '', // 名称首拼
        image: '', // 怪兽网络地址
        haoma: '' // 号码
      },
      temporaryFormData: {},
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        // importance: undefined,
        shortname: undefined,
        name: undefined,
        first: undefined,
        pid: 0,
        // sort: '+id'
      },
      //   importanceOptions: [1, 2, 3],
      //   calendarTypeOptions,
      sortOptions: [{ label: 'ID 顺序', key: '+id' }, { label: 'ID 倒序', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        shortname: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false, // 控制添加怪兽弹框
      dialogPvVisible2: false, // 控制修改怪兽弹框
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /**
     * 初始化提交表单
    */
    initFormData() {
      this.formData = {
        animal_name: '', // 怪兽名称
        ename: '', // 怪兽拼音
        efirstname: '', // 名称首拼
        image: '', // 怪兽网络地址
        haoma: '' // 号码
      }
    },
    /**
     * 怪兽删除提交
    */
    deleteAnimal(row) {
      delData(row).then(response => {
        if (response.code == 200) {
          this.$notify({
            title: 'Success',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }

      })
    },

    /**
     * 修改怪兽提交
    */
    updateAnimal() {
      editData(this.temporaryFormData).then(response => {
        console.log(response)
        if (response.code == 200) {
          this.$notify({
            title: 'Success',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          setTimeout(() => {
            this.dialogPvVisible2 = false
            this.getList()

          }, 1.5 * 1000)
        }


      })
    },
    /**
     * 添加怪兽提交
    */
    addAnimal() {
      addData(this.formData).then(response => {
        console.log(response)
        if (response.code == 200) {
          this.$notify({
            title: 'Success',
            message: '添加成功',
            type: 'success',
            duration: 2000
          })
          setTimeout(() => {
            this.dialogPvVisible = false
            this.initFormData()
            this.getList()

          }, 1.5 * 1000)
        }


      })
    },
    /**
     * 获取怪兽列表
    */
    getList() {
      this.listLoading = true
      getlist(this.listQuery).then(response => {
        this.list = response.data.listdata
        this.total = response.data.totalnum
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },


    /**
     * 调起添加弹窗
    */
    handle() {
      this.dialogPvVisible = true
    },
    /**
     * 
     * 调起修改弹窗
    */
    handle2(row) {
      console.log(row)
      this.temporaryFormData = JSON.parse(JSON.stringify(row))
      this.dialogPvVisible2 = true
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
