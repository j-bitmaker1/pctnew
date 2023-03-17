import Highcharts from 'highcharts'
import drilldownInit from 'highcharts/modules/drilldown'
import HighchartsMore from 'highcharts/highcharts-more'
import Exporting from 'highcharts/modules/exporting'
import OfflineExporting from 'highcharts/modules/offline-exporting'
import SolidGaude from 'highcharts/modules/solid-gauge'


drilldownInit(Highcharts)
HighchartsMore(Highcharts)
Exporting(Highcharts)
OfflineExporting(Highcharts)
SolidGaude(Highcharts)

export default Highcharts