<template>
    <div class="app-container">

        <el-table :key="tableKey" :data="list" border>
            <!-- <el-table-column label="ID" prop="id" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.ID }}</span>
                </template>
</el-table-column> -->
            <el-table-column label="名次" prop="id" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.SerialNumber }}</span>
                </template>
            </el-table-column>
            <el-table-column label="水位" prop="id" align="center">
                <template slot-scope="{row}">
                    <span style="font-weight: bold;" v-if="!row.Settings" @click="SettingsWaterLevel(row)">{{
                        row.waterLevel }}</span>
                    <el-input autofocus v-model="row.waterLevel" v-else @blur="row.Settings = false"
                        :ref="row.ref"></el-input>
                </template>

            </el-table-column>
            <el-table-column label="备注" prop="id" align="center">
                <template slot-scope="{row}">
                    <div @click="openDialog1(row)"> {{ row.notes ? row.notes
                        : '点击添加备注' }}</div>
                </template>

            </el-table-column>
            <el-table-column label="关键词" prop="id" align="center">
                <template slot-scope="{row}">
                    <div @click="openDialog2(row)">{{ row.keyword.length > 0 ? row.keyword.join(',')
                        : '点击添加关键词' }}</div>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title=" 备注" :visible.sync="dialogVisible" width="30%">

            <el-input v-model="temporaryObj.notes" type="textarea" placeholder="请输入备注"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>


        <el-dialog title="关键词" :visible.sync="dialogVisible2" width="30%">
            <div style="margin: 10px;">已添加关键词:{{ temporaryObj.keyword.length <= 0 ? '暂无关键词' : '' }}</div>
                    <div>

                        <el-tag v-for="(item, index) in temporaryObj.keyword" closable :disable-transitions="false"
                            size="medium" style="font-size: 20px; margin: 10px;" @close="closeTag(index)">
                            {{ item }}
                        </el-tag>
                        <!-- <div v-if="temporaryObj.keyword">
                    
                </div> -->
                    </div>

                    <div style="display: flex;"> <el-input v-model="keywordValue"></el-input><el-button
                            @click="addKeyWord">添加</el-button></div>

        </el-dialog>



    </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
    name: '',
    components: { Pagination },
    directives: { waves },
    data() {
        return {
            temporaryObj: {
                ID: 1,
                SerialNumber: 1,
                waterLevel: 200,
                Settings: false,
                notes: '', // 备注
                keyword: []
            },
            keywordValue: null,
            dialogVisible: false,
            dialogVisible2: false,
            tableKey: 0,
            list: [{
                ID: 1,
                SerialNumber: 1,
                waterLevel: 200,
                Settings: false,
                notes: '', // 备注
                keyword: []
            },
            {
                ID: 2,
                SerialNumber: 2,
                waterLevel: 200,
                Settings: false,
                notes: '', // 备注
                keyword: []
            },
            {
                ID: 3,
                SerialNumber: 3,
                waterLevel: 200,
                Settings: false,
                notes: '', // 备注
                keyword: []
            },
            {
                ID: 4,
                SerialNumber: 4,
                waterLevel: 200,
                Settings: false,
                notes: '', // 备注
                keyword: []
            },
            {
                ID: 5,
                SerialNumber: 5,
                waterLevel: 200,
                Settings: false,
                notes: '', // 备注
                keyword: []
            },
            {
                ID: 6,
                SerialNumber: 6,
                waterLevel: 200,
                Settings: false,
                notes: '', // 备注
                keyword: []
            }
            ],
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                limit: 20,
                shortname: undefined,
                name: undefined,
                first: undefined,
                pid: 0,
                // sort: '+id'
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
    methods: {
        // 删除关键词
        closeTag(index) {
            this.temporaryObj.keyword.splice(index, 1)
        },
        // 添加关键词
        addKeyWord() {
            if (this.keywordValue && this.temporaryObj['keyword']) {
                this.temporaryObj.keyword.push(this.keywordValue)
                this.keywordValue = ''
            }

        },
        // 备注框
        openDialog1(row) {
            this.dialogVisible = true
            // this.temporaryObj = JSON.parse(JSON.stringify(row))  // 深拷贝
            this.temporaryObj = row
        },
        // 关键词框
        openDialog2(row) {
            this.dialogVisible2 = true
            this.temporaryObj = row
        },
        // 编辑水位
        SettingsWaterLevel(row) {
            this.list.filter(item => {
                if (item.ID == row.ID) {
                    item.Settings = true
                } else {
                    item.Settings = false
                }
            })
            this.$nextTick(() => {
                const input = document.querySelector("input[autofocus]");
                input?.focus(); // 手动触发聚焦
            });
        }
    }
}
</script>
