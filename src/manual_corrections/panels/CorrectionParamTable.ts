class CorrectionChangeEx extends iqs.shell.CorrectionChange {
    public measure?: string;
    public currentValue?: string;
    public description?: string;
    public type?: string;
}

interface ICorrectionParamTableBindings {
    [key: string]: any;

    item: any;
    isStatistics: any;
}

const CorrectionParamTableBindings: ICorrectionParamTableBindings = {
    // event template for edit
    item: '<?iqsCorrectionParams',
    isStatistics: '<?iqsCorrectionStatistics'
}

class CorrectionParamTableChanges implements ng.IOnChangesObject, ICorrectionParamTableBindings {
    [key: string]: ng.IChangesObject<any>;

    item: ng.IChangesObject<iqs.shell.Correction>;
    isStatistics: ng.IChangesObject<boolean>;
}

class CorrectionParamTableController implements ng.IController {
    public $onInit() { }
    public item: iqs.shell.Correction;
    public isStatistics: boolean;

    public ruleMeasureTypeCollection: iqs.shell.TypeCollection;
    public correctionParametrsMeasure: iqs.shell.TypeCollection;
    private cf: Function[] = [];

    constructor(
        $rootScope: ng.IRootScopeService,
        private $element: JQuery,
        private $timeout: ng.ITimeoutService,
        private iqsTypeCollectionsService: iqs.shell.ITypeCollectionsService,
        private iqsEventRulesViewModel: iqs.shell.IEventRulesViewModel,
        private iqsZonesViewModel: iqs.shell.IZonesViewModel,
        private iqsStatisticsViewModel: iqs.shell.IStatisticsViewModel,
        private iqsLoading: iqs.shell.ILoadingService,
    ) {
        $element.addClass('iqs-correction-param-table');
        const runWhenReady = () => {
            this.iqsZonesViewModel.read();
            this.iqsEventRulesViewModel.read();
            this.ruleMeasureTypeCollection = this.iqsTypeCollectionsService.getEventRuleTypeMeasure();
            this.correctionParametrsMeasure = this.iqsTypeCollectionsService.getCorrectionParametrsMeasure();
        };
        if(this.iqsLoading.isDone) { runWhenReady(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => { runWhenReady(); }));
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    public $onChanges(changes: CorrectionParamTableChanges): void {
        this.prepare();
    }

    private setDescription(c: CorrectionChangeEx): void {
        c.description = ''
        c.measure = ''
        c.type = 'params';

        if (c.param_name) {
            c.description = 'FILTER_PARAMS_' + c.param_name.toUpperCase();
            c.measure = this.correctionParametrsMeasure[c.param_name] ? this.correctionParametrsMeasure[c.param_name].name : '';
        } else if (c.event_rule_id) {
            let rule: iqs.shell.EventRule = this.iqsEventRulesViewModel.getEventRuleById(c.event_rule_id);
            if (rule) {
                c.description = rule.name;
                if (this.ruleMeasureTypeCollection[rule.type]) c.measure = this.ruleMeasureTypeCollection[rule.type].name;
            }
            c.type = 'events';
        } else if (c.zone_id) {
            let zone: iqs.shell.Zone = this.iqsZonesViewModel.getZoneById(c.zone_id);
            if (zone) {
                c.description = zone.name;
                // todo: measure for zone?? ParameterName.Online]
                c.measure = this.correctionParametrsMeasure[iqs.shell.ParameterName.Online] ? this.correctionParametrsMeasure[iqs.shell.ParameterName.Online].name : '';
            }
            c.type = 'presence';
        }
    }

    private setCurrentValues(c: CorrectionChangeEx, callback?): void {
        c.currentValue = null;
        if (!this.isStatistics) return;

        let thirdArg = c.type == 'presence' ? c.param_name || c.event_rule_id || c.zone_id : 'all';
        let forthArg = c.type == 'presence' ? null : c.param_name || c.event_rule_id || c.zone_id;
        // get statistics and update params
        this.iqsStatisticsViewModel.getStatistics(c.type, this.item['ref_id'], thirdArg, forthArg,
            moment(this.item.time).startOf('day').toDate().toISOString(),
            moment(this.item.time).add('days', 1).startOf('day').toDate().toISOString(), iqs.shell.StatisticsDateType.daily, false,
            (statistics) => {
                let rule: iqs.shell.EventRule = this.iqsEventRulesViewModel.getEventRuleById(c.event_rule_id);
                let val = this.getSum(statistics.values);
                c.currentValue = this.iqsStatisticsViewModel.formatDisplayData(val, rule && rule.type.includes('speed') ? 'speed' : c.param_name);

                if (callback) callback();
            })
    }

    private getSum(values): number {
        let sum = 0;

        _.each(values, (val: any) => {
            sum += val.value;
        });

        return sum;
    }

    public prepare(): void {
        if (!this.iqsLoading.isDone) return;
        _.each(this.item.changes, (item: CorrectionChangeEx) => {
            this.setDescription(item);
            item.currentValue = null;
        });

        async.eachSeries(this.item.changes, (item: CorrectionChangeEx, callback) => {
            this.setCurrentValues(item, callback);
        })
    }

}

(() => {
    angular
        .module('iqsCorrectionParamTable', [
            'iqsEventRules.ViewModel',
            'iqsZones.ViewModel',
            'iqsStatistics.ViewModel',
        ])
        .component('iqsCorrectionParamTable', {
            bindings: CorrectionParamTableBindings,
            templateUrl: 'manual_corrections/panels/CorrectionParamTable.html',
            controller: CorrectionParamTableController,
            controllerAs: '$ctrl'
        })
})();
