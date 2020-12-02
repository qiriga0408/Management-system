/* eslint-disable prettier/prettier */
/**接口调用中心 只调用不处理结果 结果会通过订阅中心直接发布出去  2019/6/21 张首尚 */
// Subscription.getInstance().notify({dataType:"login"});
import Service from "./http.js";
import Subscription from "./subscription.js";
export default class Api {
    constructor() {
        this.sevr = Service.getInstance();
    }

    /**登陆接口*/
    login(v) {
        this.sevr.req({ data: { username: v.tag.username, pwd: v.tag.pwd } },
            v.tag,
            "/managers/v1/manager/login"
        );
    }

    /**谷歌验证接口 */
    loginyz(v) {
            this.sevr.req({ data: { vkey: v.tag.vkey, code: v.tag.vcode } },
                v.tag,
                "/managers/v1/manager/ckeckvkey"
            );
        }
        //////////////////////////////////////////////////
        /*币种列表*/
    bcprocoinlist(v) {
        this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
    }

    /**获取公告列表 */
    getNoticeMsg(v) {
            this.sevr.req({
                    data: {
                        "pageNo": v.tag.pageNo,
                        "pagesize": v.tag.pagesize
                    }
                },
                v.tag,
                "/managers/v1/manager/bcpronoticelist"
            );
        }
      
        /**公告置顶与取消 */
    zdOrqxNotice(v) {
            this.sevr.req({
                    data: {
                        "id": v.tag.id,
                        "isstop": parseInt(v.tag.type),
                        "weight": v.tag.weight,
                    }
                },
                v.tag,
                "/managers/v1/manager/bcpronoticeroof"
            );
        }
        /**删除公告 */
    deleteNotice(v) {
            this.sevr.req({
                    data: {
                        "id": v.tag.id,
                    }
                },
                v.tag,
                "/managers/v1/manager/bcpronoticedel"
            );
        }
        /**修改增加公告 */
    getAddupNotice(v) {
            this.sevr.req({
                    data: {
                        "type": v.tag.type,
                        "title": v.tag.title,
                        "abstract": v.tag.abstract,
                        "content": v.tag.content,
                        "contenten": v.tag.content_en,
                        "abstracten": v.tag.abstract_en,
                        "titleen": v.tag.title_en,
                        "id": v.tag.id,
                    }
                },
                v.tag,
                "/managers/v1/manager/bcpronoticeupadd"
            );
        }
        /**获取用户信息 */
    getUserInfo(v) {
        this.sevr.req({
                data: {
                    "pageNo": v.tag.pageNo,
                    "pagesize": v.tag.pagesize,
                    "username": v.tag.username,
                    "uid": v.tag.uid,
                }
            },
            v.tag,
            "/managers/v1/manager/bcprouserlist"
        );
    }
    getfo(v) {
        this.sevr.req({
                data: {
                    "pageNo": v.tag.pageNo,
                    "pagesize": v.tag.pagesize,
                    "username": v.tag.username,
                    "uid": v.tag.uid,
                }
            },
            v.tag,
            "/managers/v1/manager/bcprouserlist"
        );
    }
    bcprogetparentuid(v) {
            this.sevr.req({
                    data: {
                        "inviteparent": v.tag.inviteparent,
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprogetparentuid"
            );
        }
        /*修改用户状态 */
    setUserStatus(v) {
            this.sevr.req({
                    data: {
                        "enablelogin": v.tag.enablelogin,
                        "enablewithdraw": v.tag.enablewithdraw,
                        "enabletrade": v.tag.enabletrade,
                        "uid": v.tag.uid,
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprouserup"
            );
        }
        /**获取用户账户资产信息 */
    getUserAssetInfo(v) {
        this.sevr.req({
                data: {
                    "tdate": v.tag.tdate,
                    "uid": v.tag.uid,
                }
            },
            v.tag,
            "/managers/v1/manager/bcprouserwallet"
        );
    }

    /**获取用户交易账户资产信息 */
    getUserTradeInfo(v) {
        this.sevr.req({
                data: {
                    "tdate": v.tag.tdate,
                    "uid": v.tag.uid,
                }
            },
            v.tag,
            "/managers/v1/manager/bcprousertraderstat"
        );
    }

    /** 获取用户持仓信息*/
    getUserPositionInfo(v) {
            this.sevr.req({
                    data: {
                        "tdate": v.tag.tdate,
                        "uid": v.tag.uid,
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprousertradershop"
            );
        }
        /** 获取用户积分信息*/
    getUserPointsInfo(v) {
            this.sevr.req({
                    data: {
                        "tdate": v.tag.tdate,
                        "uid": v.tag.uid,
                    }
                },
                v.tag,
                "/managers/v1/manager/bcuserpionts"
            );
        }
        /**资产账户 财务记录 */
    getAssetFinaceRecords(v) {
            this.sevr.req({ data: v.tag.params },
                v.tag,
                "/managers/v1/manager/bcprouserwalletbill"
            );
        }
        /**资产账户 积分记录 */
    getAssetIntegralRecords(v) {
            this.sevr.req({ data: v.tag.params },
                v.tag,
                "/managers/v1/manager/bcpiontslist"
            );
        }
        /**资产账户 币种列表 */
    getAssetCoinList(v) {
            this.sevr.req({ data: {} },
                v.tag,
                "/managers/v1/manager/bcprocoinlist"
            );
        }
        /**资产账户 法币交易 */
    bcotcorderdaytotal(v) {
            this.sevr.req({
                    data: {
                        "pageNo": v.tag.pageNo,
                        "pagesize": v.tag.pagesize
                    }
                },
                v.tag,
                "/managers/v1/manager/bcotcorderdaytotal"
            );
        }
        /**资产账户 法币交易记录 */
    bcotcorderlist(v) {
            this.sevr.req({ data: v.tag.params },
                v.tag,
                "/managers/v1/manager/bcotcorderlist"
            );
        }
        /**资产账户 币种配置 */
    assetCoinSetup(v) {
        this.sevr.req({
                data: {
                    coinid: v.tag.coinid,
                    status: v.tag.status
                }
            },
            v.tag,
            "/managers/v1/manager/bcprocionsetup"
        );
    }

    /**资产账户 币种修改 */
    assetCoinEdit(v) {
            this.sevr.req({ data: v.tag.params },
                v.tag,
                "/managers/v1/manager/bcprocionupdate"
            );
        }
        /**通过提现审核 */
    tgWithdraw(v) {
        this.sevr.req({
                data: {
                    "uid": v.tag.uid,
                    "billid": v.tag.billid,
                    "status": 1,
                }
            },
            v.tag,
            "/managers/v1/manager/bcprousercashaudit"
        );
    }

    /**拒绝提现审核 */
    jjWithdraw(v) {
            this.sevr.req({
                    data: {
                        "uid": v.tag.uid,
                        "billid": v.tag.billid,
                        "status": 2,
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprousercashaudit"
            );
        }
        /**交易账户 财务记录 */
    trade_financerecords(v) {
            this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
        }
        /**合约交易 成交记录 */
    getTradeRecords(v) {
        this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
    }

    /**获取财务系统资产表 */
    getAssetTable(v) {
        this.sevr.req({
                data: {
                    tdate: v.tag.tdate
                }
            },
            v.tag,
            "/managers/v1/manager/bcprofinacewallet"
        );
    }

    /**获取财务系统资产账户 */
    getptzczh(v) {
            this.sevr.req({
                    data: {
                        "type": 1,
                        // "tdate":v.tag.tdate
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprofinaceasst"
            );
        }
        /**获取财务系统c2c地址 */
    getC2cCharge(v) {
            this.sevr.req({
                    data: {
                        "type": 3
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprofinaceasst"
            );
        }
        /**获取财务系统c2c地址 */
    getC2cChargeHistory(v) {
            this.sevr.req({
                    data: {
                        "star": v.tag.star,
                        "end": v.tag.end,
                        "pageNo": v.tag.pageNo,
                        "pagesize": v.tag.pagesize,
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprofinacec2chistroy"
            );
        }
        //c2c划转
    c2cTransfer(v) {
            this.sevr.req({
                    data: {
                        "amount": Number(v.tag.amount),
                        "coin_id": v.tag.coin_id,
                        "ttype": v.tag.ttype,
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprofinacetransfer"
            );
        }
        /**获取财务系统资产历史记录 */
    getzhptlsjl(v) {
        this.sevr.req({
                data: {
                    // "star": v.tag.star,
                    // "end": v.tag.end,
                    "pageNo": v.tag.pageNo,
                    "pagesize": v.tag.pagesize,
                }
            },
            v.tag,
            "/managers/v1/manager/bcprofinaceassethistory"
        );
    }

    /**获取财务系统交易账户 */
    getTradeAccount(v) {
        this.sevr.req({
                data: {
                    "type": 2,
                    // "tdate":v.tag.tdate
                }
            },
            v.tag,
            "/managers/v1/manager/bcprofinaceasst"
        );
    }

    /**获取财务系统交易历史记录 */
    getTradeAccountHistory(v) {
            this.sevr.req({
                    data: {
                        // "star": v.tag.star,
                        // "end": v.tag.end,
                        "pageNo": v.tag.pageNo,
                        "pagesize": v.tag.pagesize,
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprofinacecapitalhistory"
            );
        }
        /**合约交易 条件单 */
    bcproconditionorder(v) {
            this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
        }
        /**合约交易 资金费率历史 */
    bcproffundingfee(v) {
        this.sevr.req({ data: v.tag.params },
            v.tag,
            v.tag.url);
    }

    /**合约配置结算币种 */
    bcprocontractcoinlist(v) {
            this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
        }
        /**合约配置交易对 */
    bcprocontractset(v) {
            this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
        }
        /**合约配置结算币种 */
    bcprocontractset(v) {
            this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
        }
        /**合约交易 资金费率扣除 */
    bcprofunding(v) {
            this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
        }
        /**合约交易 持仓数据 */
    bcproposition(v) {
            this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
        }
        /**合约交易 指数信息 */
    bcproindexhistory(v) {
            this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
        }
        /**合约交易 资金费率扣除明细 */
    bcprofundingfeehistory(v) {
            this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
        }
        /**获取账号列表 */
    getzhlb(v) {
            this.sevr.req({ data: { name: "", pageNo: v.tag.pageNo, pagesize: v.tag.pagesize } },
                v.tag,
                "/managers/v1/manager/managelist"
            );
        }
        //获取顶层代理列表
    getTopAgentList(v) {
            this.sevr.req({ data: { uid: v.tag.uid, pageNo: v.tag.pageNo, pagesize: v.tag.pagesize, ttype: v.tag.ttype } },
                v.tag,
                "/managers/v1/manager/bcprogettopagent"
            );
        }
        //获取经纪人列表
    getAgentList(v) {
            this.sevr.req({ data: { uid: v.tag.uid, pageNo: v.tag.pageNo, pagesize: v.tag.pagesize } },
                v.tag,
                "/managers/v1/manager/bcproagentlist"
            );
        }
        //添加经纪人
    addAgent(v) {
            this.sevr.req({
                    data: {
                        uid: v.tag.uid,
                        relname: v.tag.relname,
                        agentrebateratio: v.tag.agentrebateratio
                    }
                },
                v.tag,
                "/managers/v1/manager/bcproagentadd"
            );
        }
        //添加经纪人
    addNontopAgent(v) {
        this.sevr.req({
                data: {
                    uid: v.tag.uid,
                    relname: v.tag.relname,
                    agentrebateratio: v.tag.agentrebateratio
                }
            },
            v.tag,
            "/managers/v1/manager/bcproagentadd/nontop"
        );
    }
    getAgentDetail(v) {
            this.sevr.req({
                    data: {
                        "uid": v.tag.uid,
                        "tdate": v.tag.tdate,
                    }
                },
                v.tag,
                "/managers/v1/manager/bcproagenthistory"
            );
        }
        //修改经纪人
    updateAgent(v) {
            this.sevr.req({
                    data: {
                        uid: v.tag.uid,
                        type: v.tag.type,
                        inviteparent: v.tag.inviteparent,
                        agentrebateratio: v.tag.agentrebateratio
                    }
                },
                v.tag,
                "/managers/v1/manager/bcproagentupdate"
            );
        }
        //修改经纪人
    getParentAgentUID(v) {
            this.sevr.req({
                    data: {
                        inviteparent: v.tag.inviteparent,
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprogetparentuid"
            );
        }
        //邀请奖励
    geCommissionDetails(v) {
            this.sevr.req({
                    data: {
                        uid: v.tag.uid,
                        ttype: v.tag.ttype,
                        "star": v.tag.star,
                        "end": v.tag.end,
                        "pageNo": v.tag.pageNo,
                        "pagesize": v.tag.pagesize,
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprocommissiondetails"
            );
        }
        /**获取角色分组列表 */
    getjsfz(v) {
        this.sevr.req({ data: { name: "", pageNo: 1, pagesize: 100000 } },
            v.tag,
            "/managers/v1/manager/moldelist"
        );
    }

    /**删除账号记录 */
    deleteZh(v) {
        this.sevr.req({ data: { upid: v.tag.id } },
            v.tag,
            "/managers/v1/manager/managedel"
        );
    }

    /**重置账号密码 */
    resetAccountPwd(v) {
        this.sevr.req({
                data: {
                    upid: v.tag.id,
                    pwd: v.tag.vpass1,
                    pwd2: v.tag.vpass2,
                    modelid: v.tag.level,
                    vkey: "",
                    mobile: ""
                }
            },
            v.tag,
            "/managers/v1/manager/managesave"
        );
    }

    /**修改密码 */
    updataPass(v) {
        this.sevr.req({
                data: { pwd: v.tag.ypwd, pwd1: v.tag.inputPwd1, pwd2: v.tag.inputPwd }
            },
            v.tag,
            "/managers/v1/manager/upmanagepass"
        );
    }

    /**重置谷歌密码 */
    resetGooglePwd(v) {
        this.sevr.req({
                data: {
                    upid: v.tag.id,
                    vkey: "1",
                    pwd: "",
                    pwd2: "",
                    modelid: v.tag.level,
                    mobile: ""
                }
            },
            v.tag,
            "/managers/v1/manager/managesave"
        );
    }

    /**添加账号 */
    addZhanghao(v) {
        this.sevr.req({
                data: {
                    name: v.tag.relname,
                    modelid: v.tag.lever,
                    pwd: v.tag.vpass1,
                    pwd2: v.tag.vpass2
                }
            },
            v.tag,
            "/managers/v1/manager/manageadd"
        );
    }

    /**修改分组 */
    udpateZhanghaoFz(v) {
        this.sevr.req({
                data: {
                    upid: v.tag.id,
                    modelid: v.tag.lever,
                    pwd: v.tag.vpass1,
                    pwd2: v.tag.vpass2,
                    vkey: "",
                    mobile: ""
                }
            },
            v.tag,
            "/managers/v1/manager/managesave"
        );
    }

    /**删除角色分组 */
    deleteFz(v) {
            this.sevr.req({ data: { upid: v.tag.id } },
                v.tag,
                "/managers/v1/manager/moldeldel"
            );
        }
        /**添加角色分组 */
    addFz(v) {
            // debugger;
            this.sevr.req({
                    data: {
                        model_data: JSON.stringify(v.tag.qx),
                        type: 1,
                        model_name: v.tag.model_name,
                        modelid: 0
                    }
                },
                v.tag,
                "/managers/v1/manager/moldeladd"
            );
        }
        /**修改角色分组 */
    udpateFz(v) {
        this.sevr.req({
                data: {
                    model_data: JSON.stringify(v.tag.qx),
                    type: 3,
                    model_name: v.tag.model_name,
                    modelid: parseInt(v.tag.model_id)
                }
            },
            v.tag,
            "/managers/v1/manager/moldeladd"
        );
    }

    /**获取角色分组详情 */
    getjsfzxq(v) {
        this.sevr.req({ data: { upid: parseInt(v.tag.id) } },
            v.tag,
            "/managers/v1/manager/moldelview"
        );
    }

    /**公用验证 （谷歌 和 手机）*/
    tbyz(v) {
            if (v.tag.yztype === 1) {
                this.sevr.req({ data: { code: v.tag.yzm, vkey: '' } },
                    v.tag,
                    "/managers/v1/manager/bcprofinaceckeckvkey"
                );
            } else if (v.tag.yztype === 2) {
                this.sevr.req({ data: v.tag.params },
                    v.tag,
                    "/managers/v1/manager/bccheckcodeadmin"
                );
            } else if (v.tag.yztype === 3) {
                this.sevr.req({ data: { code: v.tag.yzm, vkey: '' } },
                    v.tag,
                    "/managers/v1/manager/bcprofinaceckeckvkey"
                );
            }
        }
        /**管理员获取手机验证码 */
    bcsendsmsadmin(v) {
            this.sevr.req({ data: {} },
                v.tag,
                "/managers/v1/manager/bcsendsmsadmin"
            );
        }
        //获取对冲合约持仓
    getbcprohedgeposition(v) {
            this.sevr.req({ data: {} },
                v.tag,
                "/managers/v1/manager/bcprohedgeposition"
            );
        }
        //获取对冲合约持仓历史
    getbcprohedgepositionhistory(v) {
            this.sevr.req({
                    data: {
                        hedaccount: v.tag.hedaccount,
                        accountid: v.tag.accountid,
                        "star": v.tag.star,
                        "end": v.tag.end,
                        "pageNo": v.tag.pageNo,
                        "pagesize": v.tag.pagesize,
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprohedgepositionhistory"
            );
        }
        //获取对冲子账号列表
    getbcprohedgeaccountlist(v) {
            this.sevr.req({ data: {} },
                v.tag,
                "/managers/v1/manager/bcprohedgeaccountlist"
            );
        }
        //获取合约配置
    getbcprohedgeconfig(v) {
            this.sevr.req({ data: {} },
                v.tag,
                "/managers/v1/manager/bcprohedgeconfig"
            );
        }
        //获取合约配置
    getbcpromarketconfig(v) {
            this.sevr.req({ data: {} },
                v.tag,
                "/managers/v1/manager/bcmarketconfig"
            );
        }
        //获取合约配置
    bcprohedgeconfigup(v) {
            this.sevr.req({
                    data: { //hedaccount子账户id 添加为空 字符串类型，privatekey私钥，publickey公钥，hintphrase短语，hedgestatus 对冲状态0辅助对冲1主对冲，ttype 1重置，2添加，3设置主对冲
                        hedaccount: v.tag.hedaccount,
                        privatekey: v.tag.privatekey,
                        publickey: v.tag.publickey,
                        hedgestatus: v.tag.hedgestatus,
                        hintphrase: v.tag.hintphrase,
                        ttype: v.tag.ttype,
                        configid: v.tag.configid,
                        contractcode: v.tag.contractcode,
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprohedgeconfigup"
            );
        }
        //配置合约账户
    bcprohedgeconfigset(v) {
            this.sevr.req({
                    data: { //contractcode合约代码，lever杠杆倍数
                        hedaccount: v.tag.hedaccount,
                        margindirection: v.tag.margindirection,
                        contracttype: v.tag.contracttype,
                        accounttype: v.tag.accounttype,
                        contractcode: v.tag.contractcode,
                        lever: v.tag.lever,
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprohedgeconfigset"
            );
        }
        //获取对冲合约资产
    getbcprohedge(v) {
            this.sevr.req({
                    data: {
                        hedaccount: v.tag.hedaccount,
                        accountid: v.tag.accountid,
                        "star": v.tag.star,
                        "end": v.tag.end,
                        "pageNo": v.tag.pageNo,
                        "pagesize": v.tag.pagesize,
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprohedge"
            );
        }
        ///////////////////////////////////////////////////

    //获取用户行为
    getuserxw(v, url) {
        // this.sevr.req( {}, v.tag, url);
        Subscription.getInstance().notify(v.tag);
    }

    //获取手机设备信息数据
    getphonesbxx(v) {
        // this.sevr.req( {}, v.tag);
        Subscription.getInstance().notify(v.tag);
    }

    //获取web设备信息数据
    getwebsbxx(v) {
        // this.sevr.req( {}, v.tag);
        Subscription.getInstance().notify(v.tag);
    }

    //获取用户资产概况
    getuserassets(v, url) {
        // this.sevr.req( {}, v.tag, url);
        Subscription.getInstance().notify(v.tag);
    }

    //获取用户资产数量
    getuserassetssl(v) {
        this.sevr.req({
                data: { uid: v.tag.uid, pageNo: v.tag.pageNo, pagesize: v.tag.pagesize }
            },
            v.tag,
            "/managers/v1/manager/getusercapList"
        );
    }

    //获取用户资产数量详情
    getuserassetsslxq(v, url) {
        this.sevr.req({
                data: { uid: v.tag.uid, tdate: v.tag.tdate }
            },
            v.tag,
            url
        );
    }

    //获取用户资产每日充提数据
    getuserassetsmrct(v) {
        if (v.tag.rtype === 3) {
            this.sevr.req({
                    data: {
                        star: v.tag.star,
                        end: v.tag.end,
                        rtype: v.tag.rtype,
                        coinname: v.tag.coinname
                    }
                },
                v.tag,
                "/managers/v1/manager/getdaydiff"
            );
        } else {
            this.sevr.req({
                    data: {
                        star: v.tag.star,
                        end: v.tag.end,
                        rtype: v.tag.rtype,
                        coinname: v.tag.coinname
                    }
                },
                v.tag,
                "/managers/v1/manager/getusertotallist"
            );
        }
    }

    //获取用户资产每日充提数据
    getuserassetsmrctqst(v) {
        if (v.tag.rtype === 3) {
            this.sevr.req({
                    data: {
                        star: v.tag.star,
                        end: v.tag.end,
                        rtype: v.tag.rtype,
                        coinname: v.tag.coinname
                    }
                },
                v.tag,
                "/managers/v1/manager/getdaydiff"
            );
        } else {
            this.sevr.req({
                    data: {
                        star: v.tag.star,
                        end: v.tag.end,
                        rtype: v.tag.rtype,
                        coinname: v.tag.coinname
                    }
                },
                v.tag,
                "/managers/v1/manager/getusertotallist"
            );
        }
    }

    getuserassetsmrctqstqw(v) {
        this.sevr.req({ data: { star: v.tag.star, end: v.tag.end, rtype: v.tag.rtype } },
            v.tag,
            "/managers/v1/manager/getsmcharge"
        );
    }

    //获取充币流水
    getcblsjl(v) {
        // this.sevr.req( {}, v.tag);
        //     "name"`     // 币种名字
        // uid"`      // 用户uid
        // "acctype"`  // 账户类型 1法币
        // Cttype"`   //充1充值。15000提币
        // star"`     //
        // end"`      //
        // pageNo"`   // 页数
        // pagesize"` // 分页数量

        this.sevr.req({
                data: {
                    name: v.tag.name,
                    uid: v.tag.uid,
                    acctype: v.tag.acctype,
                    Cttype: v.tag.Cttype,
                    star: v.tag.star,
                    end: v.tag.end,
                    pageNo: v.tag.pageNo,
                    pagesize: v.tag.pagesize
                }
            },
            v.tag,
            "/managers/v1/manager/recharge"
        );
        // Subscription.getInstance().notify(v.tag);
    }

    //获取提币流水
    gettblsjl(v) {
        // this.sevr.req( {}, v.tag);
        this.sevr.req({
                data: {
                    name: v.tag.name,
                    uid: v.tag.uid,
                    acctype: v.tag.acctype,
                    Cttype: v.tag.Cttype,
                    star: v.tag.star,
                    end: v.tag.end,
                    pageNo: v.tag.pageNo,
                    pagesize: v.tag.pagesize
                }
            },
            v.tag,
            "/managers/v1/manager/recharge"
        );

        // Subscription.getInstance().notify(v.tag);
    }

    //获取提币排名
    gettbpm(v) {
        // this.sevr.req( {}, v.tag);
        Subscription.getInstance().notify(v.tag);
    }

    //获取充币排名
    getcbpm(v) {
        // this.sevr.req( {}, v.tag);
        Subscription.getInstance().notify(v.tag);
    }

    //获取交易额排名
    getjyepm(v) {
        // this.sevr.req( {}, v.tag);
        Subscription.getInstance().notify(v.tag);
    }

    //获取币种列表
    getbzlist(v) {
            this.sevr.req({ data: { pid: v.tag.pid || 1 } },
                v.tag,
                "/managers/v1/manager/getqbcurrencystock"
            );
        }
        //获取币对列表
    getbdlist(v) {
            this.sevr.req({ data: { pid: v.tag.pid || 1 } },
                v.tag,
                "/managers/v1/manager/getqbtradepair"
            );
        }
        //设置交易所配置币对
    setjyspzbd(v) {
            this.sevr.req({ data: { retype: v.tag.retype, hides: v.tag.hides } },
                v.tag,
                "/managers/v1/manager/upqbtradepair"
            );
        }
        //透视图 资金记录
    gettstzjjl(v) {

        this.sevr.req({
                data: {
                    name: v.tag.name,
                    uid: v.tag.uid,
                    acctype: v.tag.acctype,
                    Cttype: v.tag.Cttype,
                    star: v.tag.star,
                    end: v.tag.end,
                    pageNo: v.tag.pageNo,
                    pagesize: v.tag.pagesize
                }
            },
            v.tag,
            "/managers/v1/manager/recharge"
        );

    }

    //透视图 账号流水
    gettstzhls(v) {

        this.sevr.req({
                data: {
                    start_date: v.tag.start_date, //开始时间
                    end_date: v.tag.end_date, //结束时间
                    page: v.tag.pageno, //页码
                    count: v.tag.pagesize, //每页请求数量,
                    user_id: v.tag.user_id || 0, //用户id,可选,传0全部
                    coin_name: v.tag.coin_name || "", //币种名称 可选
                    op_user_name: v.tag.op_user_name || "", //操作人,可选
                    project_id: v.tag.project_id || 0, //项目id 可选 1-币币 2-otc 3-套利宝
                    audit: v.tag.audit //审核状态,""-全部 "0"-成功 "1"-待审核 "2"-拒绝
                }
            },
            v.tag,
            "/managers/v1/manager/getzfinacelist"
        );

    }




    /**合约配置手续费 */
    qbpro_hypz_sxf(v) {
        this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
    }


    /**合约交易 用户列表 */
    qbpro_hyjy_yhlb(v) {
        this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
    }

    /**合约交易 用户列表 */
    qbpro_hyjy_yhlbxq(v) {
        this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
    }


    /**合约交易 全部委托 */
    qbpro_hyjy_qbwt(v) {
        this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
    }

    /**合约交易 未成交委托 */
    qbpro_hyjy_wcjwt(v) {
        this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
    }





    /**合约交易 强平队列 */
    qbpro_hyjy_qpdl(v) {
        this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
    }

    /**交易所配置 用户分组 */
    qbpro_jyspz_yhfz(v) {
            this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
        }
        /**获取财务管理可分配账号 */
    getkfpzh_pro(v) {
        this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
    }

    /**获取财务管理可分配账号流水 */
    getkfpzh_prols(v) {
        this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
    }

    /**获取财务管理增资账号 */
    getzzzh_pro(v) {
        this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
    }

    /**获取财务管理增资账号流水 */
    getzzzh_prols(v) {
            this.sevr.req({ data: v.tag.params }, v.tag, v.tag.url);
        }
        /**获取对冲预警历史记录 */
    getbcprohedgenotice(v) {
        this.sevr.req({
                data: {
                    ttype: v.tag.ttype,
                    "star": v.tag.star,
                    "end": v.tag.end,
                    "pageNo": v.tag.pageNo,
                    "pagesize": v.tag.pagesize,
                }
            },
            v.tag,
            "/managers/v1/manager/bcprohedgenotice"
        );
    }
    bcpromarketnotice(v) {
            this.sevr.req({
                    data: {
                        ttype: v.tag.ttype,
                        contract_code: v.tag.contract_code,
                        "star": v.tag.star,
                        "end": v.tag.end,
                        "pageNo": v.tag.pageNo,
                        "pagesize": v.tag.pagesize,
                    }
                },
                v.tag,
                "/managers/v1/manager/bcpromarketnotice"
            );
        }
        /**对冲预警开关设置 */
    getbcprohedgewarnswitch(v) {
            this.sevr.req({
                    data: {
                        configid: v.tag.configid,
                        noticeswitch: v.tag.noticeswitch
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprohedgewarnswitch"
            );
        }
        /**对冲预警阈值设置 configid 数据id，maxpositionvol 最大持仓数，minavailable最小可用，
         * marginratio保证金率，noticeswitch1: 开 0:关*/
    getbcprohedgewarnset(v) {
            this.sevr.req({
                    data: {
                        configid: v.tag.configid,
                        maxpositionvol: v.tag.maxpositionvol,
                        minavailable: v.tag.minavailable,
                        marginratio: v.tag.marginratio,
                        noticeswitch: v.tag.noticeswitch
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprohedgewarnset"
            );
        }
        /**获取对冲预警邮箱列表 */
    getbcprohedgemaillist(v) {
            this.sevr.req({
                    data: {
                        ttype: v.tag.ttype ? v.tag.ttype : 1
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprohedgemaillist"
            );
        }
        /**配置对冲预警邮箱列表 */
    getbcprohedgemailup(v) {
            this.sevr.req({
                    data: {
                        mail: v.tag.mail,
                        ttype: v.tag.ttype ? v.tag.ttype : 1
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprohedgemailup"
            );
        }
        /**获取banner列表*/
    getbcprobannerlist(v) {
            this.sevr.req({
                    data: {}
                },
                v.tag,
                "/managers/v1/manager/bcprobannerlist"
            );
        }
        /**上传banner title，image返回的中文图片，imageen返回的英文图片，link中文跳转地址，linken英文跳转地址*/
    bcprobanneradd(v) {
            this.sevr.req({
                    data: {
                        title: v.tag.title,
                        image: v.tag.image,
                        imageen: v.tag.imageen,
                        link: v.tag.link,
                        linken: v.tag.linken
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprobanneradd"
            );
        }
        /**删除/排序banner*/
    bcprobannerup(v) {
            this.sevr.req({
                    data: {
                        id: v.tag.id,
                        weight: v.tag.weight,
                        type: v.tag.type
                    }
                },
                v.tag,
                "/managers/v1/manager/bcprobannerup"
            );
        }
        /**资产账户空投 */
    assetsAirdrop(v) {
        this.sevr.req({
                data: {
                    filename: v.tag.filename,
                    coin_name: v.tag.coin_name,
                    amount: Number(v.tag.amount),
                    peoples: v.tag.peoples,
                    mark: v.tag.mark,
                    coin_id: v.tag.coin_id
                }
            },
            v.tag,
            "/managers/v1/manager/bcproairdropsubmit"
        );
    }
    getAirdropList(v) {
        this.sevr.req({
                data: {
                    ttype: v.tag.ttype,
                    "star": v.tag.star,
                    "end": v.tag.end,
                    "pageNo": v.tag.pageNo,
                    "pagesize": v.tag.pagesize,
                }
            },
            v.tag,
            "/managers/v1/manager/bcotcairdroplist"
        );
    }
    bcotcairdropcheck(v) {
        this.sevr.req({
                data: {
                    ttype: v.tag.ttype,
                    Upid: v.tag.Upid,
                }
            },
            v.tag,
            "/managers/v1/manager/bcotcairdropcheck"
        );
    }
    bcotcairdropfaillist(v) {
        this.sevr.req({
                data: {
                    pid: v.tag.pid,
                    "pageNo": v.tag.pageNo,
                    "pagesize": v.tag.pagesize,
                }
            },
            v.tag,
            "/managers/v1/manager/bcotcairdropfaillist"
        );
    }
    getGradeList(v) {
        this.sevr.req({
                data: {
                    "page": Number(v.tag.pageNo) - 1, // 页码, 从0开始
                    "count": v.tag.pagesize
                }
            },
            v.tag,
            "/managers/v1/manager/app/control/history"
        );
    }
    getVersionList(v) {
        this.sevr.req({
                data: {
                    "page": Number(v.tag.pageNo) - 1, // 页码, 从0开始
                    "count": v.tag.pagesize
                }
            },
            v.tag,
            "/managers/v1/manager/app/list"
        );
    }
    addVersionRecords(v) {
        this.sevr.req({
                data: {
                    content: v.tag.content,
                    version: v.tag.version,
                    version_string: v.tag.version_string,
                    file_name: v.tag.file_name,
                    created_time: v.tag.created_time,
                }
            },
            v.tag,
            "/managers/v1/manager/app/add"
        );
    }
    addVersionConfig(v) {
        this.sevr.req({
                data: {
                    min_version: v.tag.min_version,
                    max_version: v.tag.max_version
                }
            },
            v.tag,
            "/managers/v1/manager/app/control"
        );
    }
    getProfitRanklist(v) {
        this.sevr.req({
                data: {
                    uid: v.tag.uid,
                    pageNo: v.tag.pageNo,
                    pagesize: v.tag.pagesize,
                    star: v.tag.star,
                    end: v.tag.end
                }
            },
            v.tag,
            "/managers/v1/manager/bcprofitloss"
        );
    }
    getStatisticsData(v) {
        this.sevr.req({
                data: {
                    ttype: v.tag.ttype,
                    star: v.tag.star,
                    end: v.tag.end,
                    pageNo: v.tag.pageNo,
                    pagesize: v.tag.pagesize,
                }
            },
            v.tag,
            "/managers/v1/manager/bcdataaudit"
        );
    }
    getIncomesheet(v) {
        this.sevr.req({
                data: {
                    ttype: v.tag.ttype,
                    pageNo: v.tag.pageNo,
                    pagesize: v.tag.pagesize,
                }
            },
            v.tag,
            "/managers/v1/manager/bcplatformprofit"
        );
    }
    bcmarkettick(v) {
        this.sevr.req({
                data: {
                    contractcode: v.tag.contractcode,
                    star: v.tag.star,
                    end: v.tag.end,
                    pageNo: v.tag.pageNo,
                    pagesize: v.tag.pagesize,
                }
            },
            v.tag,
            "/managers/v1/manager/bcmarkettick"
        );
    }
    bcmarketconfigup(v) {
        this.sevr.req({
                data: {
                    upid: v.tag.upid,
                    ttype: v.tag.ttype,
                    vul: v.tag.vul
                }
            },
            v.tag,
            "/managers/v1/manager/bcmarketconfigup"
        );
    }
    bcverifyhistorylist(v) {
        this.sevr.req({
                data: {
                    uid: v.tag.uid,
                    ttype: v.tag.ttype,
                    star: v.tag.star,
                    end: v.tag.end,
                    pageNo: v.tag.pageNo,
                    pagesize: v.tag.pagesize,
                }
            },
            v.tag,
            "/managers/v1/manager/bcverifyhistorylist"
        );
    }
    bcupverifyreset(v) {
        this.sevr.req({
                data: {
                    uid: v.tag.uid,
                    upid: Number(v.tag.upid),
                    stats: v.tag.stats
                }
            },
            v.tag,
            "/managers/v1/manager/bcupverifyreset"
        );
    }
    bcupverifyhistory(v) {
            this.sevr.req({
                    data: {
                        uid: v.tag.uid,
                        upid: Number(v.tag.upid),
                        stats: v.tag.stats,
                        errcode: v.tag.errcode,
                        errmsg: v.tag.errmsg,
                        birthday: v.tag.birthday,
                        age: v.tag.age
                    }
                },
                v.tag,
                "/managers/v1/manager/bcupverifyhistory"
            );
        }
        // 跟单 - 获取交易员列表
    getTradersList(v) {
            this.sevr.req({
                    data: {
                        uid: v.tag.uid,
                        star: v.tag.star,
                        end: v.tag.end,
                        pageNo: v.tag.pageNo,
                        pagesize: v.tag.pagesize,
                    }
                },
                v.tag,
                "/managers/v1/manager/followuserlist"
            );
        }
        // 跟单 - 修改交易员状态
    setTradersState(v) {
            this.sevr.req({
                    data: {
                        user_id: v.tag.user_id,
                        stype: v.tag.stype, // -1注销，0停用 1正常
                    }
                },
                v.tag,
                "/managers/v1/manager/updealeruserstat"
            );
        }
        // 跟单 - 交易员审核列表
    getTradersReview(v) {
            this.sevr.req({
                    data: {
                        uid: v.tag.uid,
                        star: v.tag.star,
                        end: v.tag.end,
                        pageNo: v.tag.pageNo,
                        pagesize: v.tag.pagesize,
                    }
                },
                v.tag,
                "/managers/v1/manager/followuserapply"
            );
        }
        // 跟单 - 交易员审核
    setTradersReview(v) {
        this.sevr.req({
                data: {
                    user_id: v.tag.user_id,
                    checkid: v.tag.checkid,
                    stype: v.tag.stype, // 1通过 2拒绝
                }
            },
            v.tag,
            "/managers/v1/manager/dealerusercheck"
        );
    }

    // 跟单 - 交易员审核列表
    setTradersReview(v) {
            this.sevr.req({
                    data: {
                        user_id: v.tag.user_id,
                        checkid: v.tag.checkid,
                        stype: v.tag.stype, // 1通过 2拒绝
                    }
                },
                v.tag,
                "/managers/v1/manager/dealerusercheck"
            );
        }
        // 跟单 - 获取当前带单
    getTradersOrderCur(v) {
            this.sevr.req({
                    data: {
                        order: v.tag.order,
                        side: v.tag.side,
                        contract_code: v.tag.contract_code,
                        uid: v.tag.uid,
                        star: v.tag.star,
                        end: v.tag.end,
                        pageNo: v.tag.pageNo,
                        pagesize: v.tag.pagesize,
                    }
                },
                v.tag,
                "/managers/v1/manager/followposition"
            );
        }
        // 跟单 - 获取当前带单-跟单详情
    getTradersOrderCurFollows(v) {
            this.sevr.req({
                    data: {
                        follow_position_id: v.tag.follow_position_id,
                    }
                },
                v.tag,
                "/managers/v1/manager/followpositionview"
            );
        }
        // 跟单 - 获取历史带单
    getTradersOrderHis(v) {
            this.sevr.req({
                    data: {
                        order: v.tag.order,
                        side: v.tag.side,
                        contract_code: v.tag.contract_code,
                        uid: v.tag.uid,
                        star: v.tag.star,
                        end: v.tag.end,
                        pageNo: v.tag.pageNo,
                        pagesize: v.tag.pagesize,
                    }
                },
                v.tag,
                "/managers/v1/manager/followtrade"
            );
        }
        // 跟单 - 获取历史带单-跟单详情
    getTradersOrderHisFollows(v) {
            this.sevr.req({
                    data: {
                        follow_position_id: v.tag.follow_position_id,
                    }
                },
                v.tag,
                "/managers/v1/manager/followtradeview"
            );
        }
        // 跟单 - 分佣列表
    getTradersPorfit(v) {
            this.sevr.req({
                    data: {
                        stype: v.tag.stype, // 1 预计返佣 2已返佣
                        uid: v.tag.uid,
                        pageNo: v.tag.pageNo,
                        pagesize: v.tag.pagesize,
                    }
                },
                v.tag,
                "/managers/v1/manager/tradefollowtotal"
            );
        }
        // 跟单 - 分佣列表-分佣详情
    getTradersOrderDetails(v) {
            this.sevr.req({
                    data: {
                        trader_uid: v.tag.trader_uid,
                        stype: v.tag.stype, // 1 预计返佣 2已返佣
                    }
                },
                v.tag,
                "/managers/v1/manager/tradefollow"
            );
        }
        // 跟单 - 分佣列表-分佣详情-获取用户返佣详情
    getUserProfit(v) {
            this.sevr.req({
                    data: {
                        start_audit_time: v.tag.start_audit_time,
                        follow_uid: v.tag.follow_uid,
                        trader_uid: v.tag.trader_uid,
                        stype: v.tag.stype, // 1 预计返佣 2已返佣
                    }
                },
                v.tag,
                "/managers/v1/manager/gettradefollowbyid"
            );
        }
        // 跟单 - 参数设置 获取
    getFollowConfig(v) {
            this.sevr.req({
                    data: {}
                },
                v.tag,
                "/managers/v1/manager/getfollowconfig"
            );
        }
        // 跟单 - 参数设置 设置
    setFollowConfig(v) {
            this.sevr.req({
                    data: {
                        min_multiple: v.tag.min_multiple, // 最小倍数
                        max_multiple: v.tag.max_multiple,
                        min_number: v.tag.min_number, // 单笔最小下单量
                        max_number: v.tag.max_number,
                    }
                },
                v.tag,
                "/managers/v1/manager/setfollowconfig"
            );
        }
        // 跟单 - 参数设置 设置资金与相关跟单人数
    setDealerPeopleConfig(v) {
            this.sevr.req({
                    data: {
                        id: v.tag.id,
                        number: v.tag.number,
                        min_amount: v.tag.min_amount, // 最小金额
                        max_amount: v.tag.max_amount,
                        stype: v.tag.stype, //1添加 2更新
                    }
                },
                v.tag,
                "/managers/v1/manager/setdealerpeopleconfig"
            );
        }
        // 跟单 - 参数设置 设置n日权重
    setDealerConfig(v) {
        this.sevr.req({
                data: {
                    day_number: v.tag.day_number, //天数
                    day_profit: v.tag.day_profit, //近n日收益率权重
                    total_profit: v.tag.total_profit, // 累计收益权重
                    winning: v.tag.winning, //近n日胜率权重
                    traders: v.tag.traders, //近n日交易量权重
                    total_profit_rate: v.tag.total_profit_rate, //近n日累计收益率权重
                }
            },
            v.tag,
            "/managers/v1/manager/setdealerconfig"
        );
    }
}