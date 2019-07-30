<template>
    <div class="el-main">
        <el-row>
            <p>基本服务>采集信息</p>
        </el-row>
        <el-table :data="list">
            <el-table-column
                    label="序号"
                    type="index"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="登录名"
                    sortable>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" title="查看" type="primary" icon="el-icon-search"
                               @click="handleEnd(scope.$index, scope.row)"></el-button>
                    <el-button size="mini" type="info" title="修改信息" icon="el-icon-edit"
                               @click="handleEdit(scope.$index, scope.row)"></el-button>
                    <el-button size="mini" icon="el-icon-delete" title="删除信息" type="danger"
                               @click="handleDelete(scope.$index, scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button type="primary" size="medium" @click="adduser">新增</el-button>
        <el-button @click="userfrist">首页</el-button>
        <el-pagination
                style="display: inline-block"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-size=pagesize
                layout="prev, pager, next,jumper"
                :total=total>
        </el-pagination>
        <el-button @click="userlast">尾页</el-button>
        <el-dialog title="编辑字典[项]" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="字典名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="add">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import ElRow from "element-ui/packages/row/src/row";
    import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue";
    import ElCol from "element-ui/packages/col/src/col";
    import {queryDictForPage} from '../api'
    import {dictInsert} from '../api'
    import {dictDelete} from '../api'
    import {queryDictOne} from '../api'

    export default {
        components: {
            ElCol,
            ElButton,
            ElRow
        },
        data() {
            return {
                input: '',
                dialogFormVisible: false,
                form: {
                    name: '',
                    password: '',
                    state: '',
                    address: '',
                    role: '',
                    fid: '',
                    _id: ''
                },
                index: '',
                formLabelWidth: '120px',
                update: false,
                list: [],
                total: 1000,//默认数据总数
                pagesize: 10,//每页的数据条数
                currentPage: 1,//默认开始页面
                id: '',
                fid: 0,
            }
        },
        methods: {
            //回填
            handleEdit(index, row) {
                this.index = index;
                this.dialogFormVisible = true;
                console.log(row._id);
                let form = row;
                this.form = form;
                this.update = true;
            },
            //删除
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log(row._id);
                    this.dictDelete(row._id);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            adduser() {
                //清空字典名称
                this.form.name = "";
                this.dialogFormVisible = true;
            },
            //修改和增加
            add() {
                if (this.update) {
                    let tableName = this.form.name;
                    let tableId = this.form._id;
                    //修改请求
                    axios
                        .post(
                            'http://127.0.0.1:7001/sys/dict/update',
                            {
                                id: tableId,
                                name: tableName
                            }
                        )
                        .then(function (data) {
                            console.log(data);
                        })
                        .catch(function (error) { // 请求失败处理
                            console.log(error);
                        });
                    this.queryDictForPageChSon(this.form.fid, this.currentPage, this.pagesize);
                    this.update = false;
                }
                else {
                    let fid = this.id;
                    //判断fid是为空还是为零
                    //为空代表没有添加过，属于父级添加
                    //为零代表代表添加过，属于子级添加
                    if (fid == "") {
                        fid = 0;
                    }
                    else if (fid == 0) {
                        fid = this.form._id;
                    }

                    let name = this.form.name;
                    this.dictInsert(name, fid);
                    this.queryDictForPageChSon(this.fid, this.currentPage, this.pagesize);
                }
                this.dialogFormVisible = false
            },
            //查询
            selectuser() {
            },
            handleSizeChange: function (size) {
                this.pagesize = size;
                console.log('我是下拉的数据', this.pagesize);//每页下拉显示数据
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.queryDictForPageChSon(this.fid, this.currentPage, this.pagesize);
            },
            //首页
            userfrist() {
                this.currentPage = 1;
                this.queryDictForPageChSon(this.fid, this.currentPage, this.pagesize);
            },
            //尾页
            userlast() {
                this.currentPage = (this.total / this.pagesize);
                this.queryDictForPageChSon(this.fid, this.currentPage, this.pagesize);
            },
            //查看下一级
            handleEnd(index, row) {
                //把id存起来
                this.fid = row._id;
                this.id = this.list[index]._id;
                this.queryDictForPageChSon(this.fid, this.currentPage, this.pagesize);
            },
            //分页查询数据
            async queryDictForPageChSon(fid, page, rows) {
                try {
                    let result = await queryDictForPage({fid: fid, page: page, rows: rows}, "GET");
                    if (result.code == 0) {
                        console.log(123);
                        this.list = result.data.list;
                        this.total = result.data.count;
                        this.$message.success('获取列表成功')
                    }
                    else {
                        this.$message.error('获取列表失败');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            //字典增加
            async dictInsert(name, fid) {
                try {
                    let result = await dictInsert({name: name, fid: fid}, "POST");
                    if (result.code == 0) {
                        this.$message.success('添加成功')
                    }
                    else {
                        this.$message.error('添加失败');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            //字典删除
            async dictDelete(id) {
                try {
                    let result = await dictDelete({id: id}, "GET");
                    if (result.code == 0) {
                        this.$message.success('删除成功');
                        this.queryDictForPageChSon(this.fid, this.currentPage, this.pagesize);
                    }
                    else {
                        this.$message.error('删除失败');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }

            },
            //字典单条查询
            async queryDictOne(id) {
                try {
                    let result = await queryDictOne({id: id}, "GET");
                    if (result.code == 0) {
                        this.$message.success('回填成功')
                        console.log(result);
                        console.log(123);
                    }
                    else {
                        this.$message.error('回填失败');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }

            },

        },
        mounted() {
            this.queryDictForPageChSon(this.fid, this.currentPage, this.pagesize);
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

    /*.el-table td,el-table th{*/
    /*text-align: center!important;*/
    /*}*/

</style>
