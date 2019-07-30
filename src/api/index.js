import ajax from './ajax'
//const BASE_URL = 'http://localhost:7001'
// const BASE_URL = 'http://info.windd.cn/collection'
const BASE_URL = 'http://10.16.8.52:7001';
/*const BASE_URL = 'http://127.0.0.1:7001';*/
/**
 * 1. 用户登录
 */
export const userLogin = (params, requestMethod) => ajax(`${BASE_URL}/sys/login/in`, params, requestMethod);

/**
 * 2.获取用户信息
 */
export const userInfo = () => ajax(`${BASE_URL}/sys/login/session`, {}, 'GET');

/**
 * 3.退出系统
 */
export const userLogout = () => ajax(`${BASE_URL}/sys/login/out`, {}, 'GET');

/**
 * 4.菜单列表
 */
export const queryMenuForList = () => ajax(`${BASE_URL}/sys/menu/list`, {}, 'GET');

/**
 * 5.菜单添加
 *    - name  菜单名称
 *    - address  菜单访问地址
 *    - fid  菜单父级节点
 */
export const menuInsert = (params, requestMethod) => ajax(`${BASE_URL}/sys/menu/add`, params, requestMethod);

/**
 * 6.菜单修改
 *    - id   菜单主键id
 *    - name  菜单名称
 *    - address  菜单访问地址
 *    - fid 菜单父级节点
 */
export const menuUpdate = (params, requestMethod) => ajax(`${BASE_URL}/sys/menu/update`, params, requestMethod);

/**
 * 7.菜单单条查询
 *    - id 菜单主键id
 */
export const queryMenuOne = (params, requestMethod) => ajax(`${BASE_URL}/sys/menu/one`, params, requestMethod);

/**
 * 8.菜单删除
 *    - id 菜单主键id
 */
export const menuDelete = (params, requestMethod) => ajax(`${BASE_URL}/sys/menu/delete`, params, requestMethod);

/**
 * 9.菜单分页查询
 */
export const queryMenuForPage = (params, requestMethod) => ajax(`${BASE_URL}/sys/menu/listForPage`, params, requestMethod);

/**
 * 10.角色分页查询
 */
export const queryRoleForPage = (params, requestMethod) => ajax(`${BASE_URL}/sys/role/list`, params, requestMethod);

/**
 * 11.角色列表查询
 */
export const queryRoleForList = () => ajax(`${BASE_URL}/sys/role/list`, {}, 'GET');

/**
 * 12.角色信息添加
 *     - name 角色名称
 *     - status 备用字段
 *     - roleMenu
 *        - [{id: 1, type: 'Checked | HalfChecked'}]
 *        - Checked 全选  HalfChecked 半选
 */
export const roleInsert = (params, requestMethod) => ajax(`${BASE_URL}/sys/role/add`, params, requestMethod);

/**
 * 13.角色信息修改
 *     - id 角色信息主键id
 *     - name 角色名称
 *     - status 备用字段
 *     - roleMenu
 *        - [{id: 1, type: 'Checked | HalfChecked'}]
 *        - Checked 全选  HalfChecked 半选
 */
export const roleUpdate = (params, requestMethod) => ajax(`${BASE_URL}/sys/role/update`, params, requestMethod);

/**
 * 14.角色信息删除
 *     - id 角色信息主键id
 */
export const roleDelete = (params, requestMethod) => ajax(`${BASE_URL}/sys/role/delete`, params, requestMethod);

/**
 * 15.角色信息单条查询
 *     - id 角色信息主键id
 */
export const queryRoleOne = (params, requestMethod) => ajax(`${BASE_URL}/sys/role/one`, params, requestMethod);

/**
 * 16.字典分页查询
 */
export const queryDictForPage = (params, requestMethod) => ajax(`${BASE_URL}/sys/dict/listForPage`, params, requestMethod);

/**
 * 17.字典单条查询
 */
export const queryDictOne = (params, requestMethod) => ajax(`${BASE_URL}/sys/dict/one`, params, requestMethod);

/**
 * 18.字典信息添加
 */
export const dictInsert = (params, requestMethod) => ajax(`${BASE_URL}/sys/dict/add`, params, requestMethod);

/**
 * 19.字典信息修改
 */
export const dictUpdate = (params, requestMethod) => ajax(`${BASE_URL}/sys/dict/update`, params, requestMethod);

/**
 * 20.字典信息删除
 */
export const dictDelete = (params, requestMethod) => ajax(`${BASE_URL}/sys/dict/delete`, params, requestMethod);

/**
 * 21.地区分页查询
 */
export const queryDeptForPage = (params, requestMethod) => ajax(`${BASE_URL}/sys/dept/listForPage`, params, requestMethod);

/**
 * 22.地区单条查询
 */
export const queryDeptOne = (params, requestMethod) => ajax(`${BASE_URL}/sys/dept/one`, params, requestMethod);

/**
 * 23.地区信息添加
 */
export const deptInsert = (params, requestMethod) => ajax(`${BASE_URL}/sys/dept/add`, params, requestMethod);

/**
 * 24.部门信息修改
 */
export const deptUpdate = (params, requestMethod) => ajax(`${BASE_URL}/sys/dept/update`, params, requestMethod);

/**
 * 25.地区信息删除
 */
export const deptDelete = (params, requestMethod) => ajax(`${BASE_URL}/sys/dept/delete`, params, requestMethod);

/**
 * 26.地区列表
 */
export const queryDeptList = () => ajax(`${BASE_URL}/sys/dept/list`, {}, 'GET');

/**
 * 26.用户分页查询
 */
export const queryUserForPage = (params, requestMethod) => ajax(`${BASE_URL}/sys/user/listForPage`, params, requestMethod);

/**
 * 27.用户添加
 */
export const userInsert = (params, requestMethod) => ajax(`${BASE_URL}/sys/user/add`, params, requestMethod);

/**
 * 28.用户修改
 */
export const userUpdate = (params, requestMethod) => ajax(`${BASE_URL}/sys/user/update`, params, requestMethod);

/**
 * 29.用户删除
 */
export const userDelete = (params, requestMethod) => ajax(`${BASE_URL}/sys/user/delete`, params, requestMethod);

/**
 * 30.用户信息单条查询
 */
export const queryUserOne = (params, requestMethod) => ajax(`${BASE_URL}/sys/user/one`, params, requestMethod);
export const queryUser = (params, requestMethod) => ajax(`${BASE_URL}/sys/user/list`, params, requestMethod);

/**
 * 31.批量添加用户
 */
export const userBatchInsert = (params, requestMethod) => ajax(`${BASE_URL}/sys/user/batchAdd`, params, requestMethod);

/**
 * 32.加载登录人的菜单权限
 */
export const loadLoginerRoleMenus = (params, requestMethod) => ajax(`${BASE_URL}/sys/menu/loginerRoleMenu`, {}, 'GET');

/**
 * 33.重置密码
 */
export const setPassword = (params, requestMethod) => ajax(`${BASE_URL}/sys/user/setPassword`, params, requestMethod);

/**
 * 34.采集信息列表
 */
export const queryInfoForPage = (params, requestMethod) => ajax(`${BASE_URL}/info/listForPage`, params, requestMethod);

/**
 * 35.采集信息详情
 */
export const queryInfoDetail = (params, requestMethod) => ajax(`${BASE_URL}/info/oneInfo`, params, requestMethod);

/**
 * 36.微信菜单信息列表
 */
export const queryWxMenuList = (params, requestMethod) => ajax(`${BASE_URL}/wx/wxmenu/list`, params, requestMethod);

/**
 * 37.微信菜单信息添加
 */
export const wxMenuAdd = (params, requestMethod) => ajax(`${BASE_URL}/wx/wxmenu/add`, params, requestMethod);

/**
 * 38.微信菜单信息修改
 */
export const wxMenuUpdate = (params, requestMethod) => ajax(`${BASE_URL}/wx/wxmenu/update`, params, requestMethod);

/**
 * 39.微信菜单信息删除
 */
export const wxMenuDelete = (params, requestMethod) => ajax(`${BASE_URL}/wx/wxmenu/delete`, params, requestMethod);

/**
 * 40.微信菜单信息单条查询
 */
export const queryWxMenuOne = (params, requestMethod) => ajax(`${BASE_URL}/wx/wxmenu/one`, params, requestMethod);

/**
 * 41.微信菜单发布
 */
export const publishWxMenu = (params, requestMethod) => ajax(`${BASE_URL}/wx/createMenu`, params, requestMethod);

/**
 * 42.采集数据导出excel
 */
export const exportList = (params, requestMethod) => ajax(`${BASE_URL}/info/exportList`, params, requestMethod);
