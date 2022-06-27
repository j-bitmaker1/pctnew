import f from "@/application/shared/functions.js"

const moment = require('moment');
import {EditStep, ViewStep, Template} from './kit.js'

class CampaignsTemplates {
    constructor({vueapi}) {
        this.vueapi = vueapi
    }

    edit_email = function(step){

    }
    edit_wait = function(step){
        return this.vueapi.customWindow(
            'modules/campaigns/steps/edit/index.vue', 
            "Add wait interval", 
            {
                step,
                type : 'wait'
            }
        )
    }
    edit_subcampaign = function(step){}
    edit_if = function(step){}

    edit_notification = function(step){
        return this.vueapi.customWindow(
            'modules/campaigns/steps/edit/index.vue', 
            "Add notification", 
            {
                step,
                type : 'notification'
            }
        )
    }

    edit_lead = function(step){}

    editstep = function(step, p = {}){
        var type = step.type()

        return this['edit_' + type](step, p)
    }

    addstep = function(p){

        var completed = false

        return new Promise((resolve, reject) => {

            var menu = [
                {
                    text: 'campaigns.add.email',
                    icon: 'fas fa-envelope',
                    type: 'email',
                },
                {
                    text: 'campaigns.add.wait',
                    icon: 'fas fa-clock',
                    type: 'wait',
                },
                {
                    text: 'campaigns.add.if',
                    icon: 'fas fa-map-signs',
                    type: 'ifstep',
                },
                {
                    text: 'campaigns.add.notification',
                    icon: 'fas fa-bell',
                    type: 'notification',
                },
                {
                    text: 'campaigns.add.lead',
                    icon: 'fas fa-user-plus',
                    type: 'lead',
                },
                {
                    text: 'campaigns.add.subcampaign',
                    icon: 'fas fa-route',
                    type: 'subcampaign',
                }
            ]

            menu = _.map(menu, (m) => {
                return {
                    ...m,
                    ... {
                        action : () => {

                            completed = true

                            var step = new EditStep({
                                id : f.makeid()
                            })

                            this['edit_' + m.type](step, p).then(resolve).catch(reject)
                        }
                    }
                }
            })

            this.vueapi.listmenupromise(menu).catch((e) => {

                if(!completed) {
                    completed = true
                    reject(e)
                }

            })

        })
    }

    clonelist = function(steps){
        return _.map(steps, (s) => {
            return s.clone()
        })
    }

    type = function(step){

        if(step.template) return 'email'

        if(step.if) return 'ifstep'

        if(step.subcampaign) return 'subcampaign'

        if(step.time) return 'wait'

        if(step.html) return 'html'

        if(step.notification) return 'notify'

        if(step.lead) return 'lead'

    }
    
    contentInfo = function(content, successindex, subin) {


        var infomask = function(){
            return {
                medianTime : 0,
                maxTime: 0,
                minTime: 0,

                successEmails : 0,
                failEmails : 0,

                successSteps : 0,
                successStepsWithoutSub : 0,

                failSteps : 0,
                failStepsWithoutSub : 0,

                completedTime : 0,

                completedEmails : 0,
                readedEmails : 0
            }
        }

        var outputInfo = infomask();

        var recursiveStep = (step, times, successindex, subin) => {
    
            var type = this.type(step);
    
            if(!successindex){
                times['successSteps']++
                times['failSteps']++
    
                if(!subin)
                    times['successStepsWithoutSub']++
                    times['failStepsWithoutSub']++
            }
            else{
                times[successindex + 'Steps']++
    
                if(!subin)
                    times[successindex + 'StepsWithoutSub']++
            }
    
            if (type == 'email'){
    
                if(!successindex){
                    times['successEmails']++
                    times['failEmails']++
                }
                else{
                    times[successindex + 'Emails']++
                }
    
                if(step.status == "COMPLETED") {
                    times.completedEmails++
    
                    if(step.track) times.readedEmails++
                }
            }
    
            //days Counting
            if (type == 'wait'){

                times.maxTime += step.duration();
                times.minTime += step.duration();
                times.completedTime += step.completedTime()
            }
    
            //ifstatement - has success/fail branching
            if(type == 'ifstep') {
                
                var successInfo = infomask();
                var failInfo = infomask();
    
                _.each(step.fail, function(step) {
                    recursiveStep(step, failInfo, 'fail');
                });
    
                _.each(step.success, function(step) {
                    recursiveStep(step, successInfo, 'success');
                });
    
                times.maxTime += Math.max(successInfo.maxTime, failInfo.maxTime);
                times.minTime += Math.min(successInfo.minTime, failInfo.minTime);

                times.completedTime += successInfo.completedTime + failInfo.completedTime
                times.completedEmails += successInfo.completedEmails + failInfo.completedEmails
                times.completedTime += successInfo.completedTime + failInfo.completedTime
            }
    
    
            //subampaign, has subind=true
            if (type == 'subcampaign'){
    
                /*var subcampaign = self.get.campaign(step.subcampaign)
    
                if (subcampaign){
                    var subTimes = this.contentInfo(subcampaign.content, successindex, true)
    
                    times.maxTime += subTimes.maxTime;
                    times.minTime += subTimes.minTime;

                    times.completedTime += subTimes.completedTime + subTimes.completedTime
                    times.completedEmails += subTimes.completedEmails + subTimes.completedEmails
                    times.completedTime += subTimes.completedTime + subTimes.completedTime
                }*/
    
            }
        }
    
        _.each(content, function(step) {
            var resultStep = infomask();
    
            recursiveStep(step, resultStep, successindex, subin);
    
            _.map(_.keys(resultStep), function(key) {
                outputInfo[key] += resultStep[key];
            });
        });

        outputInfo.medianTime = (outputInfo.maxTime + outputInfo.minTime) / 2
        outputInfo.totalEmails = outputInfo.successEmails + outputInfo.failEmails
        return outputInfo;
    }

    create = function(){
        return new Template()
    }
}

export default CampaignsTemplates;