<template>
    <div class="app-container">
        <div class="filter-container" style="margin:0 0 2% 0;">
            <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter" />
            <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
                <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                查找
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                @click="handle">
                添加用户
            </el-button>

        </div>

        <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
            style="width: 100%;" @sort-change="sortChange">
            <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80"
                :class-name="getSortClass('id')">
                <template slot-scope="{row}">
                    <span>{{ row.Id }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="代理人" width="110px" align="center">
                <template slot-scope="{row}">
                    <el-avatar :src="row.avatar"></el-avatar>
                </template>
            </el-table-column> -->
            <el-table-column label="用户名称" width="110px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.nickname }}</span>
                </template>
            </el-table-column>

            <el-table-column label="账号状态" min-width="110px" align="center">
                <template slot-scope="{row}">
                    禁用<el-switch @change="changeSwitch(row)" v-model="row.isshow" :active-value="2"></el-switch>启用
                </template>
            </el-table-column>

            <el-table-column label="总分" min-width="" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.totalscore }}</span>

                </template>
            </el-table-column>

            <el-table-column label="总金额" min-width="" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.totalmoney }}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建日期" width="100px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.Created }}</span>
                </template>
            </el-table-column>



            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-button type="primary" size="mini" @click="handle2(row)">
                        修改
                    </el-button>
                    <el-button size="mini" type="danger" @click="deleteUser(row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
            @pagination="getList" />

        <el-dialog title="添加用户" :visible.sync="dialogPvVisible">
            <el-form ref="dataForm" :model="formData" label-position="left" label-width="70px"
                style="width: 400px; margin-left:50px;">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="formData.Nickname" />
                </el-form-item>
                <el-form-item label="密码" prop="phone">
                    <el-input v-model="formData.password" />
                </el-form-item>
                <el-form-item label="初始分" prop="password">
                    <el-input v-model.number="formData.Totalscore" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogPvVisible = false">
                    取消
                </el-button>
                <el-button type="primary" @click="addUser">
                    提交
                </el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="dialogPvVisible2" title="修改用户">
            <el-form ref="dataForm" :model="temporaryFormData" label-position="left" label-width="70px"
                style="width: 400px; margin-left:50px;">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="temporaryFormData.nickname" />
                </el-form-item>
                <el-form-item label="积分" prop="password">
                    <el-input v-model.number="temporaryFormData.totalscore" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogPvVisible = false">
                    取消
                </el-button>
                <el-button type="primary" @click="updateUser">
                    提交
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
}

.avatar {
    width: 100px;
    height: 100px;
    display: block;
}
</style>
<script>
import { getlist, addData, editData, delData } from '@/api/agent'
import waves from '@/directive/waves' // waves directive 点击水波纹
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination




import request from '@/utils/request'


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
                Nickname: '', // 用户名
                Totalscore: 1000, // 初始分
                password: '', // 密码
                Isshow: 2
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
        changeSwitch(row) {
            console.log(row.isshow)
            if (!row.isshow) {
                row.isshow = 1
            }
            this.temporaryFormData = row
            this.updateUser()
        },
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
        deleteUser(row) {
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
        updateUser() {
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
        addUser() {
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
