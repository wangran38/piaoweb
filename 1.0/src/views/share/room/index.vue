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
                创建房间
            </el-button>

        </div>

        <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
            style="width: 100%;" @sort-change="sortChange">
            <el-table-column label="ID" prop="id" sortable="custom" align="center" :class-name="getSortClass('id')">
                <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="房间号" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.roomid }}</span>
                </template>
            </el-table-column>

            <el-table-column label="房间名" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.roomname }}</span>
                </template>
            </el-table-column>
            <el-table-column label="房间密钥" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.password }}</span>
                </template>
            </el-table-column>
            <el-table-column label="房间状态" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.status }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-button type="primary" size="mini" @click="handle2(row)">
                        修改
                    </el-button>
                    <el-button size="mini" type="danger" @click="deleteUser(row)">
                        关闭
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="创建房间" :visible.sync="dialogPvVisible">
            <el-form ref="dataForm" :model="formData" label-position="left" style="width: 400px; margin-left:50px;">
                <el-form-item label="房间号" prop="username">
                    <el-input v-model.number="formData.roomid" />
                </el-form-item>
                <el-form-item label="房间名" prop="phone">
                    <el-input v-model="formData.roomname" />
                </el-form-item>
                <el-form-item label="密钥" prop="phone">
                    <el-input v-model="formData.password" />
                </el-form-item>
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
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogPvVisible = false">
                    取消
                </el-button>
                <el-button type="primary" @click="addRoom">
                    提交
                </el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="dialogPvVisible2" title="修改用户">
            <el-form ref="dataForm" :model="temporaryFormData" label-position="left" label-width="70px"
                style="width: 400px; margin-left:50px;">
                <el-form-item label="房间名" prop="username">
                    <el-input v-model="temporaryFormData.roomname" />
                </el-form-item>
                <el-form-item label="密钥" prop="password">
                    <el-input v-model="temporaryFormData.password" />
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
import { getlist, addData, editData, delData } from '@/api/room'
import waves from '@/directive/waves' // waves directive 点击水波纹


export default {
    name: '',
    directives: { waves },
    data() {
        return {
            formData: {
                roomid: '', // 房间号
                roomname: '',//房间名
                password: '',//房间密钥
                status: 2
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
        },
        /**
         * 怪兽删除提交
        */
        deleteUser(row) {
            delData(row).then(response => {
                if (response.code == 200) {
                    this.$notify({
                        title: 'Success',
                        message: '关闭成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.getList()
                }

            })
        },

        updateUser() {
            editData(this.temporaryFormData).then(response => {
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
        addRoom() {
            addData(this.formData).then(response => {
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
        getSortClass: function (key) {
            const sort = this.listQuery.sort
            return sort === `+${key}` ? 'ascending' : 'descending'
        }
    }
}
</script>
