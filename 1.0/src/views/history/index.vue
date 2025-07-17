<template>
    <div class="app-container">

        <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
            style="width: 100%;" @sort-change="sortChange">
            <!-- <el-table-column label="ID" prop="id" sortable="custom" align="center" :class-name="getSortClass('id')">
                <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                </template>
</el-table-column> -->
            <el-table-column label="期号" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.qihao }}</span>
                </template>
            </el-table-column>

            <el-table-column label="第一名" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.no1 }}</span>
                </template>
            </el-table-column>
            <el-table-column label="第二名" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.no2 }}</span>
                </template>
            </el-table-column>
            <el-table-column label="第三名" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.no3 }}</span>
                </template>
            </el-table-column>
            <el-table-column label="第四名" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.no4 }}</span>
                </template>
            </el-table-column>
            <el-table-column label="第五名" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.no5 }}</span>
                </template>
            </el-table-column>

            <el-table-column label="第六名" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.no6 }}</span>
                </template>
            </el-table-column>
            <el-table-column label="时间" align="center" width="200">
                <template slot-scope="{row}">
                    <span>{{ row.createtime }}</span>
                </template>
            </el-table-column>



        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
            @pagination="getList" />


    </div>
</template>

<script>
import { getlist } from '@/api/history'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
    name: '',
    components: { Pagination },
    directives: { waves },

    data() {
        return {
            tableKey: 0,
            list: null,
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                limit: 20,
            },
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
         * 获取列表
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



        getSortClass: function (key) {
            const sort = this.listQuery.sort
            return sort === `+${key}` ? 'ascending' : 'descending'
        }
    }
}
</script>
