import Vue from 'vue';
import Router from 'vue-router';

import Login from "@/views/Login";
import Project from "@/views/Project";
import DashBoard from "@/views/DashBoard";
import RuleManage from "@/components/RuleManage";
import RuleEditor from "@/components/RuleEditor";
import Simulator from "@/components/Simulator";
import Exception404 from '@/views/exception/404'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login
        },
        {
            path: '/project',
            name: 'project',
            component: Project
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: DashBoard,
            children: [
                {
                    path: 'rule_manage',
                    name: 'ruleMange',
                    component: RuleManage,
                    props: true
                },
                {
                    path: 'rule_edit',
                    name: 'ruleEdit',
                    component: RuleEditor,
                    props: true
                },
                {
                    path: 'simulator',
                    name: 'simulator',
                    component: Simulator
                },
            ]
        },
        {
            path: '/404',
            name: '404',
            component: Exception404
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});