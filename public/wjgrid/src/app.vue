<template>
  <div class="container-fluid">
    <div class="container-panel">
      <div class="control-grid">
        <wj-pivot-panel id="sample-panel" :items-source="ngPanel" style="margin:12px 12px"></wj-pivot-panel>
      </div>
      <div class="control-grid">
        <!-- 隐藏 这些功能 暂时不需要 -->
        <!-- <div style="display:flex;alignItems:center;width:300px;padding:10px">
                     <span style="width:80px">Rows:</span> 
                     <button  class="btn btn-primary" style="margin-right:10px"  @click="gridcontrl('rowFields',1)">清空</button>  
                     <button  class="btn btn-primary"   @click="gridcontrl('rowFields',2)">展示全部</button>
                </div>
                <div  style="display:flex;alignItems:center;width:300px;padding:10px">
                     <span  style="width:80px">Columns:</span> 
                     <button  class="btn btn-primary" style="margin-right:10px"   @click="gridcontrl('columnFields',1)">清空</button>  
                     <button  class="btn btn-primary"   @click="gridcontrl('columnFields',2)">展示全部</button>
                </div>
                <div  style="display:flex;alignItems:center;width:300px;padding:10px">
                     <span  style="width:80px">Values:</span> 
                     <button  class="btn btn-primary" style="margin-right:10px"  @click="gridcontrl('valueFields',1)">清空</button>  
                     <button  class="btn btn-primary"    @click="gridcontrl('valueFields',2)">展示全部</button>
        </div>-->
        <div style="display:flex;alignItems:center;width:300px;padding:10px">
          <span style="width:80px">表格导出:</span>
          <button
            id="xlsx"
            class="btn btn-primary"
            style="margin-right:10px"
            @click="exportGrid('xlsx')"
          >XLSX</button>
          <!-- <button id="pdf" class="btn btn-primary" @click="exportGrid('pdf')">PDF</button> -->
        </div>
      </div>
    </div>

    <wj-pivot-grid :items-source="ngPanel" :initialized="initializePivotGrid"></wj-pivot-grid>

    <!-- <div class="container-chart">
      <div class="control-chart">
        <label>
          图表类型
          <wj-combo-box :items-source="chartTypes" :text-changed="onChartTypeChanged"></wj-combo-box>
        </label>

        <label class="control-chart-left">
          图例显示
          <wj-combo-box :items-source="showLegendOptions" :text-changed="onShowLegendOptionChanged"></wj-combo-box>
        </label>

        <div id="export" class="control-chart-left" v-on:click="onExportClick">
          图表导出
          <button class="btn btn-default">PNG</button>
          <button class="btn btn-default">JPEG</button>
          <button class="btn btn-default">SVG</button>
        </div>
      </div>
      <wj-pivot-chart
        control="pivotChart"
        :items-source="ngPanel"
        :show-title="true"
        show-legend="Auto"
        :initialized="initializePivotChart"
        style="margin:none;width:100%"
      ></wj-pivot-chart>
    </div> -->
  </div>
</template>
<script>
import "@grapecity/wijmo.styles/wijmo.css";
import "bootstrap.css";
import "@grapecity/wijmo.vue2.input";
import "@grapecity/wijmo.vue2.olap";
import "@grapecity/wijmo.vue2.grid";
import "@grapecity/wijmo.chart.render";
import Vue from "vue";
import * as wjcOlap from "@grapecity/wijmo.olap";
import * as wjcGridXlsx from "@grapecity/wijmo.grid.xlsx";
import * as wjcGridPdf from "@grapecity/wijmo.grid.pdf";
import * as wjcPdf from "@grapecity/wijmo.pdf";
import { CellRange } from "@grapecity/wijmo.grid";

// import { getData } from "./data";

// custom template for PivotPanel, which uses Grid-based layout for the PivotPanel
const customTemplate = `<div class="root">  
<div class="field-list-label">  
  <label wj-part="g-flds"></label>  
</div>  
<div class="field-list pad">  
  <div wj-part="d-fields"></div>  
</div>  
<div class="drag-areas-label">  
  <label wj-part="g-drag"></label>  
</div>  
<div class="filter-list pad">  
  <label>  
    <span class="wj-glyph wj-glyph-filter"></span>   
    <span wj-part="g-flt"></span>  
  </label>  
  <div wj-part="d-filters"></div>  
</div>  
<div class="column-list pad bdr-left">  
  <label>  
    <span class="wj-glyph">⫴</span>   
    <span wj-part="g-cols"></span>  
  </label>  
  <div wj-part="d-cols"></div>  
</div>  
<div class="row-list pad bdr-top">  
  <label>  
    <span class="wj-glyph">≡</span>   
    <span wj-part="g-rows"></span>  
  </label>  
  <div wj-part="d-rows"></div>  
</div>  
<div class="values-list pad bdr-left bdr-top">  
  <label>  
    <span class="wj-glyph">Σ</span>   
    <span wj-part="g-vals"></span>  
  </label>  
  <div wj-part="d-vals"></div>  
</div>  
<div wj-part="d-prog" class="progress-bar"></div>  
<div class="control-area">  
  <label>  
    <input wj-part="chk-defer" type="checkbox">   
    <span wj-part="g-defer">Defer Updates</span>  
  </label>  
  <button wj-part="btn-update" class="wj-btn" type="button">  
    Update  
  </button>  
</div>  
</div>`;

let allfields = [
  { binding: "date", header: "年", format: "yyyy" },
  { binding: "date", header: "季", format: "MMM" },
  { binding: "date", header: "月", format: "M" },
  { binding: "amount", header: "数量" },
  { binding: "to_addr", header: "接收地址" }, //
  { binding: "current_avail", header: "剩余可用" } //current_avail
];

//设置数据
window.setdata = function(data) {
  window.app.ngPanel.itemsSource = data;
};

//外部方法创建透视引擎
window.createNgPanel = function(fields) {
  allfields = fields;
  window.app.ngPanel = new wjcOlap.PivotEngine({
    autoGenerateFields: false, // turn off auto-generation
    fields: allfields,
    itemsSource: [], // raw data
    showRowTotals: "Subtotals",
    showColumnTotals: "Subtotals",
    rowFields: [], // summarize amounts
    valueFields: [] // summarize amounts
  });
};

let App = Vue.extend({
  name: "app",
  data: function() {
    return {
      ngPanel: null,
      chartTypes: "Column,Bar,Line,Area,Pie".split(","),
      showLegendOptions: "Auto,Always,Never".split(",")
    };
  },
  created: function() {
    window.app = this;
    wjcOlap.PivotPanel.controlTemplate = customTemplate;
  },
  mounted: function() {
    let divs = document.getElementsByTagName("div");
    for (let i = 0; i < divs.length; i++) {
      if (divs[i].style.zIndex == 10000) {
        divs[i].style.display = "none";
      }
    }
    // debugger;
    //调用父类方法
    parent.window && parent.window.func && parent.window.func();
    //设置所有标头到rowFields 默认全显示
    // this.ngPanel.itemsSource = getData(); //由外部传入
    for (let pro of allfields) {
      this.ngPanel.rowFields.push(pro.header);
    }
  },
  methods: {
    gridcontrl(pros, type) {
      if (type == 1) {
        //清空
        this.ngPanel[pros].clear();
      } else {
        //全部
        for (let pro of allfields) {
          this.ngPanel[pros].push(pro.header); //columnFields
        }
      }
    },
    initializePivotGrid(pivotGrid) {
      this.pivotGrid = pivotGrid;
    },
    //初始化图标对象
    initializePivotChart: pivotChart => {
      this.pivotChart = pivotChart;
    },

    //设置图标类型
    onChartTypeChanged: combo => {
      this.pivotChart.chartType = wjcOlap.PivotChartType[combo.text];
    },

    //设置是否显示图例
    onShowLegendOptionChanged(combo) {
      this.pivotChart.showLegend = wjcOlap.LegendVisibility[combo.text];
    },

    //设置是否显示标题
    onChartTitleClick(e) {
      this.pivotChart.showTitle = e.target.checked;
    },

    //导出图标
    onExportClick(e) {
      if (e.target instanceof HTMLButtonElement) {
        this.pivotChart.saveImageToFile(
          "FlexChart." + e.target.textContent.trim()
        );
      }
    },

    //导出表格
    exportGrid(docType) {
      if (docType === "csv") {
        let grid = this.pivotGrid,
          rng = new CellRange(
            0,
            0,
            grid.rows.length - 1,
            grid.columns.length - 1
          ),
          csv = grid.getClipString(rng, true, true, true); // save CSV with column and row headers
        this.exportFile(csv, "PivotGrid.csv");
      } else if (docType === "xlsx") {
        // create book with current view
        let book = wjcGridXlsx.FlexGridXlsxConverter.saveAsync(this.pivotGrid, {
          includeColumnHeaders: true,
          includeRowHeaders: true
        });
        book.sheets[0].name = "PivotGrid";
        // save the book
        book.saveAsync("PivotGrid.xlsx");
      } else if (docType === "pdf") {
        wjcGridPdf.FlexGridPdfConverter.export(
          this.pivotGrid,
          "PivotGrid.pdf",
          {
            maxPages: 10,
            scaleMode: wjcGridPdf.ScaleMode.PageWidth,
            documentOptions: {
              compress: true,
              header: { declarative: { text: "\t&[Page] of &[Pages]" } },
              footer: { declarative: { text: "\t&[Page] of &[Pages]" } },
              info: { author: "GrapeCity", title: "PivotGrid" }
            },
            styles: {
              cellStyle: { backgroundColor: "#ffffff", borderColor: "#c6c6c6" },
              altCellStyle: { backgroundColor: "#f9f9f9" },
              groupCellStyle: { backgroundColor: "#dddddd" },
              headerCellStyle: { backgroundColor: "#eaeaea" }
            }
          }
        );
      } else if (docType === "pdfdoc") {
        // create the document
        let doc = new wjcPdf.PdfDocument({
          compress: true,
          header: { declarative: { text: "\t&[Page]\\&[Pages]" } },
          ended: (sender, args) => {
            wjcPdf.saveBlob(args.blob, "PivotGridDoc.pdf");
          }
        });
        // add some content
        doc.drawText("This is a PivotGrid control:");
        // add the grid (400pt wide)
        wjcGridPdf.FlexGridPdfConverter.draw(this.pivotGrid, doc, 400);
        // finish document
        doc.end();
      }
    },

    exportFile(content, fileName) {
      let fileType = "txt/csv;charset=utf-8";
      if (navigator.msSaveBlob) {
        // IE
        navigator.msSaveBlob(
          new Blob([content], {
            type: fileType
          }),
          fileName
        );
      } else {
        let e = document.createElement("a");
        e.setAttribute(
          "href",
          "data:" + fileType + "," + encodeURIComponent(content)
        );
        e.setAttribute("download", fileName);
        e.style.display = "none";
        document.body.appendChild(e);
        e.click();
        document.body.removeChild(e);
      }
    }
  }
});

new Vue({ render: h => h(App) }).$mount("#tst");
</script>

<style>
.container {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.container-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.control-grid {
  width: 50%;
  /* border: 1px solid #ff00ff; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.spanbtn {
  display: block;
  padding: 5px 15px;
  background: #ffffff;
  border-radius: 5px;
  border: 1px solid #888888;
  margin-left: 10px;
  cursor: pointer;
}

.container-chart {
  display: flex;
  width: 100%;
  /* border: 1px solid #ff00ff; */
  flex-direction: column;
  padding: 10px;
}

.control-chart {
  /* display: none; */
  padding: 10px;
}

.control-chart-left {
  margin-left: 20px;
}

#sample-panel {
  min-height: 0;
  max-width: 600px;
  margin: 12px auto;
  display: block;
  background: #eee;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}
#sample-panel .wj-flexgrid {
  min-height: 4em;
  background: inherit;
}
.wj-pivotpanel .root {
  display: -ms-grid;
  display: grid;
  overflow: scroll;
  -ms-grid-columns: (25%) [4];
  grid-template-columns: repeat(4, 25%);
}

.wj-pivotpanel .field-list-label {
  -ms-grid-column: 1;
  -ms-grid-column-span: 2;
  grid-column: 1 / span 2;
  -ms-grid-row: 1;
  grid-row: 1;
}
.wj-pivotpanel .field-list {
  -ms-grid-column: 1;
  -ms-grid-column-span: 2;
  grid-column: 1 / span 2;
  -ms-grid-row: 2;
  -ms-grid-row-span: 2;
  grid-row: 2 / span 2;
}

.wj-pivotpanel .drag-areas-label {
  -ms-grid-column: 3;
  -ms-grid-column-span: 2;
  grid-column: 3 / span 2;
  -ms-grid-row: 1;
  grid-row: 1;
}
.wj-pivotpanel .filter-list {
  -ms-grid-column: 3;
  grid-column: 3;
  -ms-grid-row: 2;
  grid-row: 2;
}
.wj-pivotpanel .column-list {
  -ms-grid-column: 4;
  grid-column: 4;
  -ms-grid-row: 2;
  grid-row: 2;
}
.wj-pivotpanel .row-list {
  -ms-grid-column: 3;
  grid-column: 3;
  -ms-grid-row: 3;
  grid-row: 3;
}
.wj-pivotpanel .values-list {
  -ms-grid-column: 4;
  grid-column: 4;
  -ms-grid-row: 3;
  grid-row: 3;
}

.wj-pivotpanel .progress-bar {
  -ms-grid-column: 1;
  -ms-grid-column-span: 4;
  grid-column: 1 / span 4;
  -ms-grid-row: 4;
  grid-row: 4;
  width: 0px;
  height: 3px;
}

.wj-pivotpanel .control-area {
  -ms-grid-column: 1;
  -ms-grid-column-span: 4;
  grid-column: 1 / span 4;
  -ms-grid-row: 4;
  grid-row: 4;
  display: -ms-grid;
  display: grid;
  -webkit-box-align: end;
  -ms-flex-align: end;
  align-items: end;
  -ms-grid-columns: 1fr auto;
  grid-template-columns: 1fr auto;
}
.wj-pivotpanel .control-area button {
  -ms-grid-column: 2;
  grid-column: 2;
  align-self: end;
  -ms-grid-column-align: end;
}

.wj-pivotpanel .pad {
  padding: 6px;
}
.wj-pivotpanel .bdr-left {
  border-left: 1px solid rgba(0, 0, 0, 0.2);
}
.wj-pivotpanel .bdr-top {
  border-top: 1px solid rgba(0, 0, 0, 0.2);
}

.wj-pivotchart {
  margin: auto;
}
.wj-pivotchart .wj-flexchart {
  border: none;
  height: 300px;
}

body {
  margin-bottom: 24pt;
}
</style>