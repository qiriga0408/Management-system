<!--角色组内容编辑-->
<template>
  <div class="tjfz">
    <div class="w_menu">
      <span class="searchTitle">名称：</span>
      <span class="name_span" v-if="type == '1'">{{zname}}</span>
      <el-input v-else v-model="zname" placeholder="请输入分组名称" class="inputw" clearable></el-input>
      <el-button type="primary" class="buttons" @click="bc">保存</el-button>
    </div>
    <div class="w_c1">
      <span class="titlespanb">公告管理</span>
      <div class="w_c2">
        <div class="itemdiv">
          <span class="titlespan">公告管理-公告列表</span>
          <el-checkbox v-model="qx.bcpronoticelist">查看</el-checkbox>
          <el-checkbox
            v-model="qx.bcpronoticeupadd"
            @change="qx.bcpronoticelist = qx.bcpronoticeupadd || qx.bcpronoticelist"
          >修改</el-checkbox>
          <el-checkbox
            v-model="qx.bcpronoticedel"
            @change="qx.bcpronoticelist = qx.bcpronoticedel || qx.bcpronoticelist"
          >删除</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">公告管理-公告发布</span>
          <el-checkbox v-model="qx.bcpronoticeupadd">新增</el-checkbox>
        </div>
      </div>
    </div>

    <div class="w_c1">
      <span class="titlespanb">用户管理</span>
      <div class="w_c2">
        <div class="itemdiv">
          <span class="titlespan">用户管理-用户信息</span>
          <el-checkbox v-model="qx.bcprouserlist">查看</el-checkbox>
          <el-checkbox v-model="qx.bcuserpionts">积分信息</el-checkbox>
          <el-checkbox
            v-model="qx.bcprouserup"
            @change="qx.bcprouserlist = qx.bcprouserup || qx.bcprouserlist"
          >编辑</el-checkbox>
        </div>
      </div>
      <div class="itemdiv">
          <span class="titlespan">用户管理-海外地区KYC审核</span>
          <el-checkbox v-model="qx.bcverifyhistorylist">查看</el-checkbox>
          <el-checkbox v-model="qx.bcupverifyhistory">审核</el-checkbox>
          <el-checkbox v-model="qx.bcupverifyreset">重置</el-checkbox>
        </div>
    </div>

    <div class="w_c1">
      <span class="titlespanb">跟单管理</span>
      <div class="w_c2">
        <div class="itemdiv">
          <span class="titlespan">跟单管理-交易员列表</span>
          <el-checkbox v-model="qx.tradersListLook">查看</el-checkbox>
          <el-checkbox 
            v-model="qx.tradersListSet"
            @change="qx.tradersListLook = qx.tradersListSet || qx.tradersListLook"
          >操作</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">跟单管理-交易员审核</span>
          <el-checkbox v-model="qx.tradersReviewLook">查看</el-checkbox>
          <!-- <el-checkbox 
            v-model="qx.tradersReviewAdd"
            @change="qx.tradersReviewLook = qx.tradersReviewAdd || qx.tradersReviewLook"
          >添加</el-checkbox> -->
          <el-checkbox 
            v-model="qx.tradersReviewSet"
            @change="qx.tradersReviewLook = qx.tradersReviewSet || qx.tradersReviewLook"
          >操作</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">跟单管理-带单查询</span>
          <el-checkbox v-model="qx.tradersOrdersLook">查看</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">跟单管理-分佣查询</span>
          <el-checkbox v-model="qx.tradersProfitLook">查看</el-checkbox>
        </div>
      </div>
    </div>

    <div class="w_c1">
      <span class="titlespanb">资产账户</span>
      <div class="w_c2">
        <div class="itemdiv">
          <span class="titlespan">资产账户-财务记录</span>
          <el-checkbox v-model="qx.bcprouserwalletbill1">查看</el-checkbox>
          <el-checkbox v-model="qx.bcprouserwalletbill1">财务透视</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">资产账户-提币审核</span>
          <el-checkbox v-model="qx.bcprouserwalletbill2">查看</el-checkbox>
          <el-checkbox
            v-model="qx.bcprousercashaudit1"
            @change="qx.bcprousercashaudit = qx.bcprousercashaudit1 || qx.bcprouserwalletbill2"
          >通过</el-checkbox>
          <el-checkbox
            v-model="qx.bcprousercashaudit2"
            @change="qx.bcprousercashaudit = qx.bcprousercashaudit2 || qx.bcprouserwalletbill2"
          >拒绝</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">资产账户-币种配置</span>
          <el-checkbox v-model="qx.bcprocoinlist">查看</el-checkbox>
          <el-checkbox
            v-model="qx.bcprocionupdate"
            @change="qx.bcprocoinlist = qx.bcprocionupdate || qx.bcprocoinlist"
          >修改</el-checkbox>
          <el-checkbox
            v-model="qx.bcprocionsetup"
            @change="qx.bcprocoinlist = qx.bcprocionsetup || qx.bcprocoinlist"
          >设置</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">资产账户-邀请奖励</span>
          <el-checkbox v-model="qx.bcprocommissiondetails">查看</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">资产账户-法币交易</span>
          <el-checkbox v-model="qx.bcotcorderdaytotal">查看</el-checkbox>
          <el-checkbox
            v-model="qx.bcotcorderlist"
            @change="qx.bcotcorderdaytotal = qx.bcotcorderlist || qx.bcotcorderdaytotal"
          >法币交易订单</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">资产账户-积分记录</span>
          <el-checkbox v-model="qx.bcpiontslist">查看</el-checkbox>
        </div>
      </div>
    </div>
    <div class="w_c1">
      <span class="titlespanb">交易账户</span>
      <div class="w_c2" style="flex-direction: column">
        <div class="itemdiv">
          <span class="titlespan">交易账户-财务记录</span>
          <el-checkbox v-model="qx.bcaccountlist">查看</el-checkbox>
          <el-checkbox v-model="qx.bcaccountlist">财务透视</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">交易账户-资金费率历史</span>
          <el-checkbox v-model="qx.bcproffundingfee">查看</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">交易账户-资金费用扣除</span>
          <el-checkbox v-model="qx.bcprofunding">查看</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">交易账户-总盈亏排名</span>
          <el-checkbox v-model="qx.bcprofitloss">查看</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">交易账户-合约配置-保证金币种配置</span>
          <el-checkbox v-model="qx.bcprocontractcoinlist">查看</el-checkbox>
          <el-checkbox
            v-model="qx.bcprocontractcoinadd"
            @change="qx.bcprocontractcoinlist = qx.bcprocontractcoinadd || qx.bcprocontractcoinlist"
          >添加</el-checkbox>
          <el-checkbox
            v-model="qx.bcprocontractcoinset"
            @change="qx.bcprocontractcoinlist = qx.bcprocontractcoinadd || qx.bcprocontractcoinlist"
          >上下架</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">交易账户-合约配置-合约交易对配置</span>
          <el-checkbox v-model="qx.bcprocontractset">查看</el-checkbox>
          <el-checkbox
            v-model="qx.bcprocontractadd"
            @change="qx.bcprocontractset = qx.bcprocontractadd || qx.bcprocontractset"
          >添加/修改</el-checkbox>
          <el-checkbox
            v-model="qx.bcprocontractset_onlinestatus"
            @change="qx.bcprocontractset = qx.bcprocontractset_onlinestatus || qx.bcprocontractset"
          >上下架</el-checkbox>
          <el-checkbox
            v-model="qx.bcprocontractset_openorderenable"
            @change="qx.bcprocontractset = qx.bcprocontractset_openorderenable || qx.bcprocontractset"
          >开仓/平仓</el-checkbox>
          <el-checkbox
            v-model="qx.bcprocontractset_ispositions"
            @change="qx.bcprocontractset = qx.bcprocontractset_ispositions || qx.bcprocontractset"
          >全部平仓</el-checkbox>
          <el-checkbox
            v-model="qx.bcprocontractset_islodge"
            @change="qx.bcprocontractset = qx.bcprocontractset_islodge || qx.bcprocontractset"
          >全部撤单</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">交易账户-合约配置-合约列表排序</span>
          <el-checkbox v-model="qx.bcprocontractset">查看</el-checkbox>
          <el-checkbox
            v-model="qx.bcprocontractsort"
            @change="qx.bcprocontractset = qx.bcprocontractsort || qx.bcprocontractset"
          >排序</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">交易账户-合约交易-成交记录</span>
          <el-checkbox v-model="qx.bcprotraderhistory">查看</el-checkbox>
          <el-checkbox v-model="qx.bcprotraderhistory">成交记录透视</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">交易账户-合约交易-逐仓强平记录</span>
          <el-checkbox v-model="qx.bcprotraderhistoryside">查看</el-checkbox>
          <!-- <el-checkbox v-model="qx.bcprotraderhistoryside">逐仓强平记录透视</el-checkbox> -->
        </div>
        <div class="itemdiv">
          <span class="titlespan">交易账户-合约交易-计划单</span>
          <el-checkbox v-model="qx.bcproconditionorder">查看</el-checkbox>
          <el-checkbox
            v-model="qx.bcproconditionsheetcancel"
            @change="qx.bcproconditionorder = qx.bcproconditionsheetcancel || qx.bcproconditionorder"
          >撤单</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">交易账户-合约交易-持仓数据</span>
          <el-checkbox v-model="qx.bcproposition">查看</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">交易账户-合约交易-指数信息</span>
          <el-checkbox v-model="qx.bcproindexhistory">查看</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">交易账户-合约交易-TICK数据存储</span>
          <el-checkbox v-model="qx.bcmarkettick">查看</el-checkbox>
        </div>
      </div>
    </div>
    <div class="w_c1">
      <span class="titlespanb">财务系统</span>
      <div class="w_c2" style="flex-direction: column">
        <div class="itemdiv">
          <span class="titlespan">财务系统-资产表</span>
          <el-checkbox v-model="qx.bcprofinacewallet1">查看</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">财务系统-平台资产账户</span>
          <el-checkbox v-model="qx.bcprofinaceasst1">查看</el-checkbox>
          <el-checkbox v-model="qx.bcprofinaceasst1">充币</el-checkbox>
          <el-checkbox
            v-model="qx.bcprofinaceckeckvkey"
            @change="qx.bcprofinaceasst1 = qx.bcprofinaceckeckvkey || qx.bcprofinaceasst1"
          >提币</el-checkbox>
          <el-checkbox
            v-model="qx.bcproairdropsubmit"
            @change="qx.bcprofinaceasst1 = qx.bcproairdropsubmit || qx.bcprofinaceasst1"
          >空投</el-checkbox>
          <el-checkbox
            v-model="qx.bcprofinaceassethistory"
            @change="qx.bcprofinaceasst1 = qx.bcprofinaceassethistory || qx.bcprofinaceasst1"
          >查看历史记录</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">财务系统-平台交易账户</span>
          <el-checkbox v-model="qx.bcprofinaceasst2">查看</el-checkbox>
          <el-checkbox
            v-model="qx.bcprofinacecapitalhistory"
            @change="qx.bcprofinaceasst2 = qx.bcprofinacecapitalhistory || qx.bcprofinaceasst2"
          >查看历史记录</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">财务系统-平台充币地址c2c使用</span>
          <el-checkbox v-model="qx.bcprofinaceasst3">查看</el-checkbox>
          <el-checkbox
            v-model="qx.bcprofinacec2chistroy"
            @change="qx.bcprofinaceasst3 = qx.bcprofinacec2chistroy || qx.bcprofinaceasst3"
          >查看历史记录</el-checkbox>
          <el-checkbox
            v-model="qx.bcprofinacetransfer"
            @change="qx.bcprofinaceasst3 = qx.bcprofinacetransfer || qx.bcprofinaceasst3"
          >划转</el-checkbox>
          <el-checkbox v-model="qx.bcprofinaceasst3">充币</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">财务系统-空投审核</span>
          <el-checkbox v-model="qx.bcotcairdroplist">查看</el-checkbox>
          <el-checkbox
            v-model="qx.bcproairdropdownload"
            @change="qx.bcotcairdroplist = qx.bcproairdropdownload || qx.bcotcairdroplist"
          >下载空投数据</el-checkbox>
          <el-checkbox v-model="qx.bcotcairdropfaillist">查看详情</el-checkbox>
          <el-checkbox
            v-model="qx.bcotcairdropcheck1"
            @change="qx.bcotcairdroplist = qx.bcotcairdropcheck1 || qx.bcotcairdroplist"
          >通过</el-checkbox>
          <el-checkbox
            v-model="qx.bcotcairdropcheck2"
            @change="qx.bcotcairdroplist = qx.bcotcairdropcheck2 || qx.bcotcairdroplist"
          >拒绝</el-checkbox>
          <el-checkbox
            v-model="qx.bcotcairdropfaillist"
            @change="qx.bcotcairdroplist = qx.bcotcairdropfaillist || qx.bcotcairdroplist"
          >查看失败列表</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">财务系统-统计及审计-资产账户清算统计</span>
          <el-checkbox v-model="qx.bcdataaudit1">充币清算统计</el-checkbox>
          <el-checkbox v-model="qx.bcdataaudit2">提币清算统计</el-checkbox>
          <el-checkbox v-model="qx.bcdataaudit3">法币购买清算统计</el-checkbox>
          <el-checkbox v-model="qx.bcdataaudit4">转出清算统计</el-checkbox>
          <el-checkbox v-model="qx.bcdataaudit5">转入清算统计</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">财务系统-统计及审计-USDT交易账户清算统计</span>
          <el-checkbox v-model="qx.bcdataaudit6">账户资产清算统计</el-checkbox>
          <el-checkbox v-model="qx.bcdataaudit7">可用余额清算统计</el-checkbox>
          <el-checkbox v-model="qx.bcdataaudit8">保证金清算统计</el-checkbox>
          <el-checkbox v-model="qx.bcdataaudit9">已实现盈亏清算统计</el-checkbox>
          <el-checkbox v-model="qx.bcdataaudit10">转入清算统计</el-checkbox>
          <el-checkbox v-model="qx.bcdataaudit11">转出清算统计</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">财务系统-平台内利润表</span>
          <el-checkbox v-model="qx.bcplatformprofit">查看</el-checkbox>
        </div>
      </div>
    </div>
    <div class="w_c1">
      <span class="titlespanb">对冲系统</span>
      <div class="w_c2" style="flex-direction: column">
        <div class="itemdiv">
          <span class="titlespan">USDT合约持仓数据</span>
          <el-checkbox v-model="qx.bcprohedgeposition">查看</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">USDT对冲子账号资产</span>
          <el-checkbox v-model="qx.bcprohedge">查看</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">USDT对冲账后持仓数据</span>
          <el-checkbox v-model="qx.bcprohedgepositionhistory">查看</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">USDT对冲子账号配置</span>
          <el-checkbox v-model="qx.bcprohedgeconfig">查看</el-checkbox>
          <el-checkbox
            v-model="qx.bcprohedgeconfigup"
            @change="qx.bcprohedgeconfig = qx.bcprohedgeconfigup || qx.bcprohedgeconfig"
          >添加/重置子账号</el-checkbox>
          <el-checkbox
            v-model="qx.bcprohedgeconfigset"
            @change="qx.bcprohedgeconfig = qx.bcprohedgeconfigset || qx.bcprohedgeconfig"
          >配置合约账户</el-checkbox>
        </div>
      </div>
    </div>
    <div class="w_c1">
      <span class="titlespanb">预警系统</span>
      <div class="w_c2" style="flex-direction: column">
        <div class="itemdiv">
          <span class="titlespan">对冲预警</span>
          <el-checkbox v-model="qx.bcprohedgeconfig">查看</el-checkbox>
          <el-checkbox v-model="qx.bcprohedgemailup">配置预警邮件</el-checkbox>
          <el-checkbox v-model="qx.bcprohedgewarnset">配置阈值</el-checkbox>
          <el-checkbox v-model="qx.bcprohedgewarnswitch">开启/关闭预警</el-checkbox>
          <el-checkbox v-model="qx.bcprohedgenotice">查看预警记录</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">行情接口预警</span>
          <el-checkbox v-model="qx.bcmarketconfig">查看</el-checkbox>
          <el-checkbox v-model="qx.bcprohedgemailup2">配置预警邮件</el-checkbox>
          <el-checkbox v-model="qx.bcmarketconfigup1">配置阈值</el-checkbox>
          <el-checkbox v-model="qx.bcmarketconfigup2">开启/关闭预警</el-checkbox>
          <el-checkbox v-model="qx.bcpromarketnotice">查看预警记录</el-checkbox>
        </div>
      </div>
    </div>
    <div class="w_c1">
      <span class="titlespanb">系统配置</span>
      <div class="w_c2" style="flex-direction: column">
        <div class="itemdiv">
          <span class="titlespan">安卓APP升级</span>
          <el-checkbox v-model="qx.appcontrolhistory">查看配置记录</el-checkbox>
          <el-checkbox
            v-model="qx.appcontrol"
            @change="qx.appcontrolhistory = qx.appcontrol || qx.appcontrolhistory"
          >添加版本控制</el-checkbox>
          <el-checkbox
            v-model="qx.applist"
            @change="qx.appcontrolhistory = qx.applist || qx.appcontrolhistory"
          >查看版本记录</el-checkbox>
          <el-checkbox
            v-model="qx.applistadd"
            @change="qx.appcontrolhistory = qx.applistadd || qx.appcontrolhistory"
          >添加版本记录</el-checkbox>
        </div>
        <!-- <div class="itemdiv">
          <span class="titlespan">下载地址上传安装包</span>
          <el-checkbox v-model="qx.bcprooperatelist">查看操作记录</el-checkbox>
          <el-checkbox
            v-model="qx.bcproandroidupload"
            @change="qx.bcprooperatelist = qx.bcproandroidupload || qx.bcprooperatelist"
          >上传文件</el-checkbox>
        </div>-->
        <div class="itemdiv">
          <span class="titlespan">首页BANNER配置</span>
          <el-checkbox v-model="qx.bcprobannerlist">查看</el-checkbox>
          <el-checkbox
            v-model="qx.bcprobannerupload"
            @change="qx.bcprobannerlist = qx.bcprobannerupload || qx.bcprobannerlist"
          >添加BANNER</el-checkbox>
          <el-checkbox
            v-model="qx.bcprobannerup0"
            @change="qx.bcprobannerlist = qx.bcprobannerup0 || qx.bcprobannerlist"
          >排序</el-checkbox>
          <el-checkbox
            v-model="qx.bcprobannerup1"
            @change="qx.bcprobannerlist = qx.bcprobannerup1 || qx.bcprobannerlist"
          >删除</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">带单参数设置</span>
          <el-checkbox v-model="qx.followParameterSet">操作</el-checkbox>
        </div>
      </div>
    </div>
    <div class="w_c1">
      <span class="titlespanb">账号管理</span>
      <div class="w_c2" style="flex-direction: column">
        <div class="itemdiv">
          <span class="titlespan">账号管理-账号列表</span>
          <el-checkbox v-model="qx.manageadd">添加账号</el-checkbox>
          <el-checkbox v-model="qx.managedel">删除</el-checkbox>
          <el-checkbox v-model="qx.managesave3">修改</el-checkbox>
          <el-checkbox v-model="qx.managesave1">重置登陆密码</el-checkbox>
          <el-checkbox v-model="qx.managesave2">重置谷歌密码</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">账号管理-角色分组</span>
          <el-checkbox v-model="qx.moldeladd">添加分组</el-checkbox>
          <el-checkbox v-model="qx.moldeldel">删除</el-checkbox>
          <el-checkbox v-model="qx.managesave">修改</el-checkbox>
        </div>
      </div>
    </div>
    <div class="w_c1">
      <span class="titlespanb">代理管理</span>
      <div class="w_c2" style="flex-direction: column">
        <div class="itemdiv">
          <span class="titlespan">代理管理-添加顶层代理</span>
          <el-checkbox style="min-width:120px;text-align:left" v-model="qx.bcprogettopagent">查看</el-checkbox>
          <el-checkbox
            style="min-width:120px;text-align:left"
            v-model="qx.bcproagentadd"
            @change="qx.bcprogettopagent = qx.bcproagentadd || qx.bcprogettopagent"
          >开通代理</el-checkbox>
        </div>
        <div class="itemdiv">
          <span class="titlespan">代理管理-代理列表</span>
          <el-checkbox style="min-width:120px;text-align:left" v-model="qx.bcproagentlist">查看</el-checkbox>
          <el-checkbox
            style="min-width:120px;text-align:left"
            v-model="qx.nontop"
            @change="qx.bcproagentlist = qx.nontop || qx.bcproagentlist"
          >开通非顶层代理</el-checkbox>
          <el-checkbox
            style="min-width:120px;text-align:left"
            v-model="qx.bcproagenthistory"
            @change="qx.bcproagentlist = qx.bcproagenthistory || qx.bcproagentlist"
          >查看详情</el-checkbox>
          <el-checkbox
            style="min-width:120px;text-align:left"
            v-model="qx.bcproagentupdate"
            @change="qx.bcproagentlist = qx.bcproagentupdate || qx.bcproagentlist"
          >修改配置</el-checkbox>
          <el-checkbox
            style="min-width:120px;text-align:left"
            v-model="qx.bcproagentupdate1"
            @change="qx.bcproagentlist = qx.bcproagentupdate1 || qx.bcproagentlist"
          >重置登陆密码</el-checkbox>
          <el-checkbox
            style="min-width:120px;text-align:left"
            v-model="qx.bcproagentupdate2"
            @change="qx.bcproagentlist = qx.bcproagentupdate2 || qx.bcproagentlist"
          >重置谷歌密码</el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { GETJSFZXQ, TJFZ, XGFZ2 } from "@/constant";
import { type } from "os";
export default {
  data() {
    return {
      zname: "",
      id: "",
      type: "1",
      qx: {
        //公告管理
        bcpronoticelist: false, //查看 公告列表
        bcpronoticeupadd: false, //修改 公告列表
        bcpronoticedel: false, //删除 公告列表
        //用户数据
        bcprouserlist: false, //查看 用户信息
        bcprouserup: false, //编辑 用户编辑
        bcuserpionts: false,
        bcverifyhistorylist: false, 
        bcupverifyhistory: false, 
        bcupverifyreset: false,
        // 跟单管理
        tradersListLook: false, // 交易员列表 - 查看
        tradersListSet: false,  // 交易员列表 - 操作
        tradersReviewLook: false, // 交易员审核 - 查看
        // tradersReviewAdd: false,  // 交易员审核 - 添加
        tradersReviewSet: false,  // 交易员审核 - 操作
        tradersOrdersLook: false,   // 交易员带单 - 查看
        tradersProfitLook: false, // 交易员分佣 - 查看
        followParameterSet: false, // 带单参数设置 - 操作
        //资产账户
        bcprouserwalletbill1: false, //财务记录
        bcprouserwalletbill2: false, //查看  资产账户-提现审核
        bcprousercashaudit1: false, //通过  资产账户-提现审核
        bcprousercashaudit2: false, //拒绝  资产账户-提现审核
        bcprocoinlist: false, //币种列表
        bcprocionupdate: false, //.币种修改
        bcprocionsetup: false, //币种设置
        bcotcorderdaytotal: false,
        bcotcorderlist: false,
        bcpiontslist: false,
        //交易账户
        bcaccountlist: false, //财务记录
        bcproffundingfee: false, //资金费率历史
        bcprofunding: false, //资金费用扣除
        bcprofitloss: false,
        bcprocontractcoinlist: false, //保证金币种配置
        bcprocommissiondetails: false, //邀请奖励-查看
        //按钮权限
        bcprocontractcoinset: false, //上下架
        bcprocontractcoinadd: false, //添加币种
        bcprocontractsort: false, //合约交易对排序
        bcprocontractset: false, //交易对配置
        //按钮权限
        bcprocontractset_onlinestatus: false, //上下架
        bcprocontractset_openorderenable: false, //开关开仓
        bcprocontractset_ispositions: false, //全部平仓
        bcprocontractset_islodge: false, //全部撤单
        bcprocontractadd: false, //添加/修改交易对配置

        bcprotraderhistory: false, //合约交易永续合约成交记录
        bcproconditionorder: false, //合约交易条件单
        //权限按钮
        bcproconditionsheetcancel: false, //撤单
        bcprotraderhistoryside: false,
        bcproposition: false, //合约交易持仓数据
        bcproindexhistory: false, //合约交易指数信息
        bcmarkettick:false,
        //财务系统
        bcprofinacewallet1: false, //财务系统-资产表查看
        bcprofinaceasst1: false, //财务系统-平台资产账户查看
        bcprofinaceckeckvkey: false, //财务系统-平台资产账户-提币
        bcprofinaceassethistory: false, //财务系统-平台资产账户-历史记录
        bcprofinaceasst2: false, //财务系统-平台交易账户查看
        bcprofinacecapitalhistory: false, //财务系统-平台交易账户-历史记录
        bcprofinaceasst3: false,
        bcprofinacec2chistroy: false,
        bcprofinacetransfer: false,
        bcotcairdroplist: false,
        bcproairdropdownload: false,
        bcotcairdropcheck1: false,
        bcotcairdropcheck2: false,
        bcproairdropsubmit: false,
        bcotcairdropfaillist: false,
        bcdataaudit1: false,
        bcdataaudit2: false,
        bcdataaudit3: false,
        bcdataaudit5: false,
        bcdataaudit4: false,
        bcdataaudit6: false,
        bcdataaudit7: false,
        bcdataaudit8: false,
        bcdataaudit9: false,
        bcdataaudit11: false,
        bcdataaudit10: false,
        bcplatformprofit:false,
        //权限管理
        manageadd: false, //添加账号  账号管理-账号列表
        managedel: false, //删除  账号管理-账号列表
        managesave: false, //修改  账号管理-账号列表
        managesave1: false, //重置登陆密码  账号管理-账号列表
        managesave2: false, //重置谷歌密码  账号管理-账号列表
        moldeladd: false, //添加分组 账号管理-角色分组
        moldeldel: false, //删除 账号管理-角色分组
        managesave: false, //修改 账号管理-角色分组
        managesave3: false,
        //经纪人管理
        bcprogettopagent: false,
        bcproagentlist: false, //查看
        nontop: false,
        bcproagentadd: false, //添加
        bcproagentupdate: false, //修改
        bcproagenthistory: false, //查看明细
        bcproagentupdate1: false, //重置登陆密码
        bcproagentupdate2: false, //重置谷歌密码
        //对冲系统
        bcprohedgeposition: false,
        bcprohedge: false,
        bcprohedgepositionhistory: false,
        bcprohedgeconfig: false,
        bcprohedgeconfigup: false,
        bcprohedgeconfigset: false,
        //预警系统
        bcprohedgewarnset: false, //配置阈值
        bcprohedgewarnswitch: false, //开启/关闭预警
        bcprohedgenotice: false, //预警历史记录
        bcprohedgemailup: false,
        bcmarketconfig: false, 
        bcprohedgemailup2: false, 
        bcmarketconfigup1: false, 
        bcmarketconfigup2: false, 
        bcpromarketnotice: false,
        //系统配置-banner配置
        bcprobannerlist: false,
        bcprobannerupload: false,
        bcprobannerup0: false,
        bcprobannerup1: false,
        appcontrolhistory: false,
        appcontrol: false,
        applist: false,
        applistadd: false
        // bcprooperatelist: false,
        // bcproandroidupload: false,
      }
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [GETJSFZXQ, TJFZ, XGFZ2];
    if (this.$route.query.type == "1") {
      //修改 获取详细配置
      this.$api.getjsfzxq({
        tag: { dataType: GETJSFZXQ, id: this.$route.query.id }
      });
    }
    this.type = this.$route.query.type;

    if (this.$route.query.name) {
      this.zname = this.$route.query.name;
    }
  },
  computed: {},
  methods: {
    bc() {
      if (this.type == "1") {
        this.$api.udpateFz({
          tag: {
            dataType: XGFZ2,
            qx: this.qx,
            model_id: this.$route.query.id,
            model_name: this.zname
          }
        });
      } else {
        let t = false;
        for (let pro in this.qx) {
          if (this.qx[pro]) {
            t = true;
          }
        }
        if (this.zname == null || this.zname == "") {
          this.$msg({
            title: "警告",
            message: "请填写分组名称",
            type: "warning"
          });
        } else if (!t) {
          this.$msg({ title: "警告", message: "请勾选权限", type: "warning" });
        } else {
          this.$api.addFz({
            tag: { dataType: TJFZ, qx: this.qx, model_name: this.zname }
          });
        }
      }
    },
    isShow() {
      let level = localStorage.getItem("level");
      level = JSON.parse(level);
      return level === "1";
    },
    message(tag, data) {
      switch (tag.dataType) {
        case GETJSFZXQ:
          if (data.data) {
            let mode = JSON.parse(JSON.parse(data.data.modedata));
            Object.assign(this.qx, mode);
            // console.log(typeof mode)
          }
          break;
        case TJFZ: //添加分组
          if (data.ret === 0) {
            this.$router.go(-1);
            this.$msg({ title: "成功", message: data.msg, type: "success" });
          }
          break;
        case XGFZ2: //修改分组内容
          if (data.ret === 0) {
            this.$router.go(-1);
            this.$msg({ title: "成功", message: data.msg, type: "success" });
          }
          break;
      }
    }
  },

  beforeDestroy() {
    this.$unRegister(this);
  }
};
</script>

<style lang="less" scoped>
.inputw {
  width: 150px;
  padding-right: 30px;
}
.name_span {
  padding-top: 2px;
}
.inputs {
  padding-right: 30px;
}

.buttons {
  margin-left: 89px;
}

.checkboxp {
  padding: 3px 0;
}

.dc() {
  display: flex;
  padding: 10px 0px;
  box-sizing: border-box;
  border-bottom: 1px solid#F0F2F5;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  // flex-direction: column;
}

.tjfz {
  width: 100%;
  display: flex;
  flex-direction: column;
  .w_menu {
    width: 100%;
    height: 50px;
    // padding-left:15px;
    padding-top: 15px;
    padding-bottom: 15px;
    flex-shrink: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .searchTitle {
      padding: 0;
    }
  }
  .zc {
    & > div {
      display: flex;
    }
  }
  .w_c1 {
    .dc();
    flex-direction: column;
    .titlespanb {
      text-align: left;
      font-weight: 900;
      padding: 2px 0px;
    }
    .w_c2 {
      display: flex;
      flex-wrap: wrap;
      padding: 2px 0px;
    }
    .itemdiv {
      display: flex;
      min-width: 900px;
      padding: 4px 0;
      .titlespan {
        display: inline-block;
        width: 300px;
        text-align: left;
        font-size: 14px;
      }
    }
  }
  .w_page {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-top: 10px;
    padding-right: 30px;
  }
}

.dialogc {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dialogstip {
  color: red;
  padding: 20px 10px;
}
</style>
