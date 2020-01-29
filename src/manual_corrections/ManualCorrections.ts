import { ICorrectionsViewModel } from '../models';

export const ManualCorrectionsStateName: string = 'app';

class ManualCorrectionTabs {
    title: string;
    id: number;
}

class StatisticsManualCorrectionsController implements ng.IController {
    public $onInit() { }
    public section: number;
    public sections: ManualCorrectionTabs[] = [
        { title: 'MANUAL_CORRECTIONS_REQUEST', id: 0 },
        { title: 'MANUAL_CORRECTIONS_HISTORY', id: 1 }
    ];

    public details: boolean;

    public new: iqs.shell.Correction;
    public edit: iqs.shell.Correction;
    public currentState: string;

    public selectedItem: iqs.shell.Correction = null;
    private _prevSelectedItem: iqs.shell.Correction = null;
    private cf: Function[] = [];
    private mediaSizeGtSm: boolean;
    public isPreLoading: boolean = true;

    constructor(
        $rootScope: ng.IRootScopeService,
        public pipMedia: pip.layouts.IMediaService,
        private $state: ng.ui.IStateService,
        private $location: ng.ILocationService,
        private pipNavService: pip.nav.INavService,
        private pipConfirmationDialog: pip.dialogs.IConfirmationDialogService,
        private pipTranslate: pip.services.ITranslateService,
        private iqsOrganization: iqs.shell.IOrganizationService,
        private iqsCorrectionsViewModel: ICorrectionsViewModel,
        private iqsCorrectionsHistoryViewModel: ICorrectionsViewModel,
        private iqsObjectsViewModel: iqs.shell.IObjectsViewModel,
        private iqsObjectGroupsViewModel: iqs.shell.IObjectGroupsViewModel,
        private iqsLoading: iqs.shell.ILoadingService,
    ) {
        "ngInject";

        this.mediaSizeGtSm = this.pipMedia('gt-sm');
        if (!this.pipMedia('gt-sm')) {
            if (this.currentState === iqs.shell.States.Add || this.currentState === iqs.shell.States.Edit) {
                this.details = true;
            } else {
                this.details = $location.search().details == 'details' ? true : false;
            }
        } else {
            this.details = false;
            this.$location.search('details', 'main');
        }

        const runWhenReady = () => {
            this.section = this.$location.search()['section'] || this.sections[0].id;
            this.selectSection(this.section);
            this.iqsCorrectionsViewModel.read();

            this.iqsCorrectionsHistoryViewModel.filter = {
                skip: 0,
                take: 100,
                total: false
            };
            this.iqsCorrectionsHistoryViewModel.read(() => {
                this.isPreLoading = false;
            });
        };

        if (this.iqsLoading.isDone) { runWhenReady(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => { runWhenReady(); }));
        this.cf.push($rootScope.$on(pip.services.IdentityChangedEvent, () => {
            this.appHeader();
        }));
        this.cf.push($rootScope.$on('pipMainResized', () => {
            if (this.mediaSizeGtSm !== this.pipMedia('gt-sm')) {
                this.mediaSizeGtSm = this.pipMedia('gt-sm');

                if (this.pipMedia('gt-sm')) {
                    this.details = false;
                } else {
                    if (this.currentState === iqs.shell.States.Add || this.currentState === iqs.shell.States.Edit) {
                        this.details = true;
                    }
                }
                this.appHeader();
            }
        }));
        this.appHeader();
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    public selectSection(id: number) {
        this.$location.search('section', this.section);
        this.section = id;
    }

    public get transaction(): pip.services.Transaction {
        return this.iqsCorrectionsViewModel.getTransaction();
    }

    public get collection(): iqs.shell.Correction[] {
        return this.iqsCorrectionsViewModel.collection;
    }

    public get transactionHistory(): pip.services.Transaction {
        return this.iqsCorrectionsHistoryViewModel.getTransaction();
    }

    public get collectionHistory(): iqs.shell.Correction[] {
        return this.iqsCorrectionsHistoryViewModel.collection;
    }

    public get state(): string {
        if (this.section == 0) {
            return this.currentState ? this.currentState : this.iqsCorrectionsViewModel.state;
        } else {
            return this.currentState ? this.currentState : this.iqsCorrectionsHistoryViewModel.state;
        }
    }

    public onSelectRequestCor(item) {
        this.selectedItem = item;
    }

    public onSelectHistoryCor(item) {
        this.selectedItem = item;
        if (!this.pipMedia('gt-sm')) {
            this.details = true;
            this.$location.search('details', 'details');
            this.appHeader();
        }
    }

    public onAdd() {
        this.new = new iqs.shell.Correction();
        this.edit = null;
        this.currentState = iqs.shell.States.Add;
        this._prevSelectedItem = _.cloneDeep(this.selectedItem);
        this.selectedItem = null;
        if (!this.pipMedia('gt-sm')) {
            this.details = true;
            this.$location.search('details', 'details');
            this.appHeader();
        }
    }


    public reload(): void {
        this.iqsCorrectionsViewModel.reload();
        this.iqsCorrectionsHistoryViewModel.reload();
    }

    public onEdit(correction: iqs.shell.Correction) {
        this.edit = _.cloneDeep(correction);
        this.new = null;
        this.currentState = iqs.shell.States.Edit;
        this._prevSelectedItem = _.cloneDeep(this.selectedItem);
        this.selectedItem = null;
        if (!this.pipMedia('gt-sm')) {
            this.details = true;
            this.$location.search('details', 'details');
            this.appHeader();
        }
    }

    public onDelete(correction: iqs.shell.Correction) {
        if (this.transaction.busy()) {
            return;
        }

        if (correction && correction.id) {
            this.pipConfirmationDialog.show(
                {
                    event: null,
                    title: this.pipTranslate.translate('CORRECTIONS_DELETE_CONFIRMATION_TITLE') + ' "' + correction.reason + '"?',
                    ok: 'CONFIRM_DELETE',
                    cancel: 'CONFIRM_CANCEL'
                },
                () => {
                    this.onDeleteItem(correction);
                },
                () => {
                    console.log('You disagreed');
                }
            );
        }
    }

    public onSave(item: iqs.shell.Correction, isUpdateStatus?: boolean): void {
        if (this.transaction.busy() || !item) {
            return;
        }

        if (this.currentState == iqs.shell.States.Add) {
            item.org_id = this.iqsOrganization.orgId;
            item.status = iqs.shell.CorrectionStatus.Requested;
            this.iqsCorrectionsViewModel.create(
                item,
                (data: iqs.shell.Correction) => {
                    this.currentState = null
                    this.new = null;
                    this.iqsCorrectionsViewModel.getCollection();
                    setTimeout(() => {
                        this.selectedItem = data;
                    }, 300);
                },
                (error: any) => { }
            );
        } else if (this.currentState == iqs.shell.States.Edit || isUpdateStatus) {
            this.iqsCorrectionsViewModel.updateCorrectionById(
                item.id,
                item,
                (data: iqs.shell.Correction) => {
                    this.currentState = null
                    this.edit = null;
                    if (isUpdateStatus) {
                        this.iqsCorrectionsViewModel.removeItem(item.id);
                    }
                    this.iqsCorrectionsHistoryViewModel.reload();
                    this.iqsCorrectionsViewModel.getCollection();
                    this.iqsCorrectionsHistoryViewModel.getCollection();
                    // setTimeout(() => {
                    //     this.selectedItem = data;
                    // }, 300);
                },
                (error: any) => { }
            );
        }
    }

    public onCancel() {
        this.currentState = null;
        this.new = null;
        this.edit = null;
        this.toMainFromDetails();
        setTimeout(() => {
            this.selectedItem = _.cloneDeep(this._prevSelectedItem);
        }, 300);
    }

    public onDeleteItem(item: iqs.shell.Correction) {
        if (this.transaction.busy()) {
            return;
        }

        if (item && item.id) {
            this.iqsCorrectionsHistoryViewModel.deleteCorrectionById(
                item.id,
                () => {
                    this.iqsCorrectionsHistoryViewModel.getCollection();
                },
                (error: any) => { }
            );
        }
    }

    public onApproved(item: iqs.shell.Correction): void {
        if (this.transaction.busy() || !item || !item.id) {
            return;
        }

        item.status = iqs.shell.CorrectionStatus.Approved;
        this.onSave(item, true);
    }

    public onReject(item: iqs.shell.Correction): void {
        if (this.transaction.busy() || !item || !item.id) {
            return;
        }

        item.status = iqs.shell.CorrectionStatus.Rejected;
        this.onSave(item, true);
    }

    private toMainFromDetails(): void {
        this.$location.search('details', 'main');
        this.details = false;
        this.appHeader();
    }

    private getSelectedName(): string {
        let c = this.selectedItem;
        if (c.object_id) {
            let object: any = this.iqsObjectsViewModel.getObjectById(c.object_id);
            if (object) {
                return object.name;
            }
        }
        if (c.group_id) {
            let group: any = this.iqsObjectGroupsViewModel.getGroupById(c.group_id);
            if (group) {
                return group.name;
            }
        }

        return '';
    }

    private appHeader(): void {
        this.pipNavService.appbar.removeShadow();
        this.pipNavService.appbar.parts = { 'icon': true, 'actions': 'primary', 'menu': true, 'title': 'breadcrumb', 'organizations': this.pipMedia('gt-sm') };
        this.pipNavService.breadcrumb.breakpoint = 'gt-sm';

        if (!this.pipMedia('gt-sm') && this.details) {

            this.pipNavService.breadcrumb.items = [
                <pip.nav.BreadcrumbItem>{
                    title: "MANUAL_CORRECTIONS", click: () => {
                        this.toMainFromDetails();
                    }, subActions: []
                },
                <pip.nav.BreadcrumbItem>{
                    title: 'MANUAL_CORRECTIONS' + this.getSelectedName(), click: () => { }, subActions: []
                }
            ];
            this.pipNavService.icon.showBack(() => {
                this.toMainFromDetails();
            });
        } else {
            this.pipNavService.breadcrumb.text = 'MANUAL_CORRECTIONS';
            this.pipNavService.icon.showMenu();
        }

        this.pipNavService.actions.hide();
    }
}

function statisticsManualCorrectionsRoute(
    $injector: angular.auto.IInjectorService,
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider
        .state(ManualCorrectionsStateName, {
            url: '/app',
            controller: StatisticsManualCorrectionsController,
            auth: true,
            controllerAs: '$ctrl',
            templateUrl: 'manual_corrections/ManualCorrections.html'
        });
}

function statisticsManualCorrectionsAccess(
    iqsAccessConfigProvider: iqs.shell.IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = iqs.shell.AccessRole.manager;
    let accessConfig: any = {};
    iqsAccessConfigProvider.registerStateAccess(ManualCorrectionsStateName, accessLevel);
    iqsAccessConfigProvider.registerStateConfigure(ManualCorrectionsStateName, accessConfig);
}

(() => {

    angular
        .module('iqsManualCorrections', ['pipNav',
            'iqsCorrectionEmptyPanel',
            'iqsCorrectionRequestListPanel',
            'iqsCorrectionRequestDetailsPanel',
            'iqsCorrectionEditPanel',
            'iqsCorrectionHistoryListPanel',
            'iqsCorrectionHistoryDetailsPanel',
            'iqsCorrectionParamTable',
            'iqsCorrections.ViewModel',
            'iqsCorrectionsHistory.ViewModel',
            'iqsObjects.ViewModel',
            'iqsObjectGroups.ViewModel',
        ])
        .config(statisticsManualCorrectionsRoute)
        .config(statisticsManualCorrectionsAccess);
})();
