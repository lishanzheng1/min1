<template>
    <div class="el-main">
        <el-table :data="list">
            <el-table-column
                    label="序号"
                    type="index"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="olds[0].name"
                    label="老人姓名"
                    sortable>
            </el-table-column>
            <el-table-column
                    prop=""
                    label="年龄"
                    sortable>
            </el-table-column>
            <el-table-column
                    prop="olds[0].idNumber"
                    label="身份证号"
                    sortable>
            </el-table-column>
            <el-table-column
                    prop="olds[0].phone"
                    label="常用联系电话"
                    sortable>
            </el-table-column>
            <el-table-column
                    prop="olds[0].address"
                    label="居住地址"
                    sortable>
            </el-table-column>
            <el-table-column
                    prop="time"
                    label="采集时间"
                    sortable>
            </el-table-column>
            <el-table-column
                    prop="shorts[0].name"
                    label="采集员"
                    sortable>
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="状态"
                    :formatter="stateFormatter"
                    sortable>
            </el-table-column>
        </el-table>
        <pages
                style="display: inline-block"
                :total=total
                :currentPage=currentPage
                :pageSize=pagesize
                @handleCurrentChangeSub="handleCurrentChange">
        </pages>
    </div>
</template>
<script>
    import ElRow from "element-ui/packages/row/src/row";
    import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue";
    import ElCol from "element-ui/packages/col/src/col";
    import {queryInfoForPage} from '../api'

    export default {
        components: {
            ElCol,
            ElButton,
            ElRow
        },
        data() {
            return {
                formLabelWidth: '120px',
                list: [],
                total: 1000,//默认数据总数
                pagesize: 10,//每页的数据条数
                currentPage: 1,//默认开始页面

            }
        },
        methods: {
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.queryInfoForPage1(this.currentPage, this.pagesize);
            },

            stateFormatter(row) {
                if(row.status === 0){
                    return '否'
                } else {
                    return '是'
                }
            },
            //分页查询数据
            async queryInfoForPage1(page, rows) {
                try {
                    let result = await queryInfoForPage({queryName: '', page: page, rows: rows}, "GET");
                    if (result.code == 0) {
                        console.log(result);
                        this.list = result.data.list;
                        this.total = result.data.count;
                    }
                    else {
                        this.$message.error('获取列表失败');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
        },
        mounted() {
            this.queryInfoForPage1(this.currentPage, this.pagesize);
        },

    }
</script>
<style>
    .el-main {
    }

    .el-main button {
        margin-left: 20px !important;
    }

    em {
        font-style: normal;
        margin-right: 10px;
    }

    li {
        display: inline-grid;
    }
</style>
