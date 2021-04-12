import Vue from 'vue';
import Router from 'vue-router';

import Login from "@/views/Login";
import Project from "@/views/Project";
import DashBoard from "@/views/DashBoard";
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
            component: DashBoard
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