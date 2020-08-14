import HomeView from "./views/Home.vue";
import AthleteView from "./views/Athlete.vue";
import AthleteSearchView from "./views/AthleteSearch.vue";
import CompetitionView from "./views/Competition.vue";
import CompetitionSearchView from "./views/CompetitionSearch.vue";
import EventView from "./views/Event.vue";
import EventsView from "./views/EventList.vue";

export default [
  {
    path: "/",
    name: "home",
    component: HomeView
  },
  {
    path: "/athlete/import/",
    name: "athlete-import",
    component: () =>
      import(
        /* webpackChunkName: "athlete-import" */ "./views/AthleteImport.vue"
      )
  },
  {
    path: "/athlete/search/",
    name: "athlete-search",
    component: AthleteSearchView
  },
  {
    path: "/athlete/:athlete_id",
    name: "athlete",
    component: AthleteView
  },
  {
    path: "/competition/search/",
    name: "competition-search",
    component: CompetitionSearchView
  },
  {
    path: "/competition/:competition_id",
    name: "competition",
    component: CompetitionView
  },
  {
    path: "/competition/:competition_id/import",
    name: "result-import",
    component: () =>
      import(/* webpackChunkName: "result-import" */ "./views/ResultImport.vue")
  },
  {
    path: "/event/create/",
    name: "event-create",
    component: () =>
      import(/* webpackChunkName: "event-manage" */ "./views/EventManage.vue")
  },
  {
    path: "/event/:event_id",
    name: "event",
    component: EventView
  },
  {
    path: "/events/",
    name: "events",
    component: EventsView
  },
  {
    path: "/event/:event_id/update",
    name: "event-update",
    component: () =>
      import(/* webpackChunkName: "event-manage" */ "./views/EventManage.vue")
  },
  {
    path: "/event/:event_id/competition/create/",
    name: "competition-create",
    component: () =>
      import(
        /* webpackChunkName: "event-manage" */ "./views/CompetitionManage.vue"
      )
  },
  {
    path: "/event/:event_id/competition/update/:competition_id",
    name: "competition-update",
    component: () =>
      import(
        /* webpackChunkName: "event-manage" */ "./views/CompetitionManage.vue"
      )
  },
  {
    path: "/records/",
    name: "records",
    component: () =>
      import(/* webpackChunkName: "records" */ "./views/Records.vue")
  },
  {
    path: "/result/:result_id/update/",
    name: "result-update",
    component: () =>
      import(/* webpackChunkName: "result-manage" */ "./views/ResultManage.vue")
  },
  {
    path: "/info/",
    name: "info",
    component: () => import(/* webpackChunkName: "info" */ "./views/Info.vue")
  },
  {
    path: "/info/competitiontype/:competition_type_id/",
    name: "info-competitiontype",
    component: () =>
      import(/* webpackChunkName: "info" */ "./views/InfoCompetitionType.vue")
  },
  {
    path: "/info/organization/",
    name: "info-organization",
    component: () =>
      import(/* webpackChunkName: "info" */ "./views/InfoOrganization.vue")
  },
  {
    path: "/info/sport/",
    name: "info-sport",
    component: () =>
      import(/* webpackChunkName: "info" */ "./views/InfoSport.vue")
  },
  {
    path: "/statistics/",
    name: "statistics",
    component: () =>
      import(/* webpackChunkName: "statistics" */ "./views/Statistics.vue")
  },
  {
    path: "/statistics/malja/",
    name: "statistics-malja",
    component: () =>
      import(
        /* webpackChunkName: "statistics-pm" */ "./views/StatisticsPohjolanMalja.vue"
      )
  },
  {
    path: "/login",
    beforeEnter(to, from) {
      location.href =
        process.env.VUE_APP_LOGIN_URL + "login?next=/#" + from.path;
    }
  },
  {
    path: "/logout",
    beforeEnter() {
      location.href = process.env.VUE_APP_LOGIN_URL + "logout?next=/";
    }
  },
  {
    path: "/results/:model_name/:object_id/history/",
    name: "changelog",
    beforeEnter(to) {
      location.href = process.env.VUE_APP_ADMIN_URL + to.path;
    }
  }
];
