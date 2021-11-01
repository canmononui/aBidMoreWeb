import { Component, OnInit } from '@angular/core';
// CHART
import { Chart } from 'chart.js';

@Component({
  selector: 'app-modal-popup-ads',
  templateUrl: './modal-popup-ads.component.html',
  styleUrls: ['./modal-popup-ads.component.css']
})
export class ModalPopupAdsComponent implements OnInit {

  // CHART
  timeCountChart: any = [];
  public timeCount = 0
  public timeCountServer = 10

  constructor() { }

  ngOnInit(): void {
    // SET DATA
    this.timeCount = this.timeCountServer
    // CHART
    Chart.defaults.RoundedDoughnut = Chart.helpers.clone(Chart.defaults.doughnut);
    Chart.controllers.RoundedDoughnut = Chart.controllers.doughnut.extend({
      draw: function (ease) {
        var ctx = this.chart.chart.ctx;

        var easingDecimal = ease || 1;
        Chart.helpers.each(this.getMeta().data, function (arc, index) {
          arc.transition(easingDecimal).draw();

          var vm = arc._view;
          var radius = (vm.outerRadius + vm.innerRadius) / 2;
          var thickness = (vm.outerRadius - vm.innerRadius) / 2;
          var angle = Math.PI - vm.endAngle - Math.PI / 2;

          ctx.save();
          ctx.fillStyle = vm.backgroundColor;
          ctx.translate(vm.x, vm.y);
          ctx.beginPath();
          ctx.arc(radius * Math.sin(angle), radius * Math.cos(angle), thickness, 0, 2 * Math.PI);
          ctx.arc(radius * Math.sin(Math.PI), radius * Math.cos(Math.PI), thickness, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        });
      },
    });

    // SET DATA & OPTION CHART
    var deliveredData = {
      datasets: [
        {
          data: [85, 15],
          backgroundColor: [
            "#FE5721",
            "rgba(0,0,0,0)"
          ],
          hoverBackgroundColor: [
            "#FE5721",
            "rgba(0,0,0,0)"
          ],
          borderWidth: [
            0, 0
          ]
        }]
    };
    // SET DATA & OPTION CHART
    var deliveredOpt = {
      cutoutPercentage: 88,
      animation: {
        animationRotate: true,
        duration: 2000
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      elements: {
        center: {
          text: '10s',
          color: '#FE5721', // Default is #000000
          fontStyle: 'Kanit', // Default is Arial
          sidePadding: 30, // Default is 20 (as a percentage)
          minFontSize: 25, // Default is 20 (in px), set to false and text will not wrap.
          lineHeight: 25 // Default is 25 (in px), used for when text wraps
        }
      },
    };
    // CREATE CHART => timeCountChart
    var chart = new Chart('timeCountChart', {
      type: 'RoundedDoughnut',
      data: deliveredData,
      options: deliveredOpt
    });
  }

}
