<template>
    <div class="el-main">
        <el-row>
            <li>采集人员管理</li>
            <li v-for="(tops,index) in toplist" @click="topclick(index)">>{{tops.name}}</li>
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
    import {dictUpdate} from '../api'

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
                toplist:[{
                    fid: '0',
                    name: '字典管理'
                }
                ],
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
            //导航条点击事件
            topclick(index){
                let fid=this.toplist[index].fid;
                this.queryDictForPageChSon(fid, this.currentPage, this.pagesize);
                let unmber=this.toplist.length-index;
                this.toplist.splice(index+1,unmber);
            },
            //回填
            handleEdit(index, row) {
                this.index = index;
                this.dialogFormVisible = true;
                console.log(row._id);
                this.form = row;
                //中断form和list集合的联动，list重新获取一下数据
                this.queryDictForPageChSon(this.fid, this.currentPage, this.pagesize);
                this.update = true;
            },
            //删除
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                    this.dictDelete(row._id);
                }).catch(() => {
                });
            },
            adduser() {
                //清空字典名称
                this.form.name = "";
                this.dialogFormVisible = true;
            },
            //修改和增加
            add() {
                //true是修改
                if (this.update) {
                    let tableName = this.form.name;
                    let tableId = this.form._id;
                    this.dictUpdate(tableId, tableName);
                    this.queryDictForPageChSon(this.form.fid, this.currentPage, this.pagesize);
                    this.update = false;
                }
                //false是添加
                else {
                    let fid = this.id;
                    //判断fid是为空
                    //初始值为空代表父级
                    //有值的话代表的是子级
                    if (fid == "") {
                        fid = 0;
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
                //向上取整，因为有时候会有小数
                this.currentPage = Math.ceil(this.total / this.pagesize);
                this.queryDictForPageChSon(this.fid, this.currentPage, this.pagesize);
            },
            //查看下一级
            handleEnd(index, row) {
                //把id和name放进toplist 导航条根据name显示，数据根据fid查询 下一级的fid等于上一级的id
                this.toplist.push({fid:row._id,name:row.name});
                this.fid = row._id;
                //把id存起来
                this.id = this.list[index]._id;
                this.queryDictForPageChSon(this.fid, this.currentPage, this.pagesize);
            },
            //分页查询数据
            async queryDictForPageChSon(fid, page, rows) {
                try {
                    let result = await queryDictForPage({fid: fid, page: page, rows: rows}, "GET");
                    if (result.code == 0) {
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
            //字典增加
            async dictInsert(name, fid) {
                try {
                    let result = await dictInsert({name: name, fid: fid}, "POST");
                    if (result.code == 0) {
                        this.$message.success('添加成功');
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
                    console.log(result);
                    this.queryDictForPageChSon(this.fid, this.currentPage, this.pagesize);
                    if (result.code == 0) {
                        if (result.data.status === -1) {
                            this.$message.error('字典还有对应的字典项无法删除');
                        }
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
            //字典修改
            async dictUpdate(id, name) {
                try {
                    let result = await dictUpdate({id: id, name: name}, "POST");
                    if (result.code == 0) {
                        this.$message.success('修改成功')
                        console.log(result);
                        console.log(123);
                    }
                    else {
                        this.$message.error('修改失败');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }

            }

        },
        //在渲染成html后调用 获取字典数据
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
    li{
        display: inline-grid;
    }

    /*.el-table td,el-table th{*/
    /*text-align: center!important;*/
    /*}*/

</style>
