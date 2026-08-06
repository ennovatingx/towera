import type { RouteObject } from "react-router-dom";
import { Outlet } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Chat from "../pages/chat/page";

import StudioLanding from "../pages/studio/page";
import StudioAuthProvider from "../pages/studio/layout/StudioAuthProvider";
import StudioAppLayout from "../pages/studio/layout/StudioAppLayout";
import DashboardRedirect from "../pages/studio/layout/DashboardRedirect";
import LoginPage from "../pages/studio/auth/LoginPage";
import RegisterPage from "../pages/studio/auth/RegisterPage";
import ForgotPasswordPage from "../pages/studio/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/studio/auth/ResetPasswordPage";
import ChangePasswordPage from "../pages/studio/account/ChangePasswordPage";
import RoleGuard from "../pages/studio/shared/RoleGuard";

import AdminOverviewPage from "../pages/studio/admin/OverviewPage";
import AdminLanguagesPage from "../pages/studio/admin/LanguagesPage";
import AdminPhrasesPage from "../pages/studio/admin/PhrasesPage";
import AdminTranslationsPage from "../pages/studio/admin/TranslationsPage";
import AdminUsersPage from "../pages/studio/admin/UsersPage";
import AdminExportPage from "../pages/studio/admin/ExportPage";
import AdminPayoutsPage from "../pages/studio/admin/PayoutsPage";

import ContributePhraseListPage from "../pages/studio/contribute/PhraseListPage";
import ContributeTranslatePage from "../pages/studio/contribute/TranslatePage";
import MySubmissionsPage from "../pages/studio/contribute/MySubmissionsPage";
import EarningsPage from "../pages/studio/contribute/EarningsPage";

import ReviewQueuePage from "../pages/studio/review/QueuePage";
import ReviewDetailPage from "../pages/studio/review/DetailPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/studio",
    element: (
      <StudioAuthProvider>
        <Outlet />
      </StudioAuthProvider>
    ),
    children: [
      { index: true, element: <StudioLanding /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
      {
        element: <StudioAppLayout />,
        children: [
          { path: "dashboard", element: <DashboardRedirect /> },
          { path: "account/password", element: <ChangePasswordPage /> },
          {
            path: "admin",
            element: <RoleGuard allow={["admin"]} />,
            children: [
              { index: true, element: <AdminOverviewPage /> },
              { path: "languages", element: <AdminLanguagesPage /> },
              { path: "phrases", element: <AdminPhrasesPage /> },
              { path: "translations", element: <AdminTranslationsPage /> },
              { path: "users", element: <AdminUsersPage /> },
              { path: "export", element: <AdminExportPage /> },
              { path: "payouts", element: <AdminPayoutsPage /> },
            ],
          },
          {
            path: "contribute",
            element: <RoleGuard allow={["contributor"]} />,
            children: [
              { index: true, element: <ContributePhraseListPage /> },
              { path: "my-submissions", element: <MySubmissionsPage /> },
              { path: "earnings", element: <EarningsPage /> },
              { path: ":phraseId", element: <ContributeTranslatePage /> },
            ],
          },
          {
            path: "review",
            element: <RoleGuard allow={["reviewer", "admin"]} />,
            children: [
              { index: true, element: <ReviewQueuePage /> },
              { path: ":translationId", element: <ReviewDetailPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
