function initPopulating(
    iqsEventRulesViewModel: iqs.shell.IEventRulesViewModel,
    pipIdentity: pip.services.IIdentityService,
    iqsLoading: iqs.shell.ILoadingService
) {
    iqsLoading.push('data', [
        iqsEventRulesViewModel.clean.bind(iqsEventRulesViewModel)
    ], async.parallel, [
            (callback) => {
                iqsEventRulesViewModel.filter = null;
                iqsEventRulesViewModel.isSort = true;
                iqsEventRulesViewModel.reload(
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            }
        ]);
    if (pipIdentity.identity && pipIdentity.identity.id) {
        iqsLoading.start();
    }
}


let m: any;
const requires = [
    'iqsEventRules.ViewModel',
    'iqsOrganizations.Service',
];

try {
    m = angular.module('iqsLoading');
    m.requires.push(...requires);
    m.run(initPopulating);
} catch (err) { }