import { createHashRouter, Navigate } from 'react-router-dom';
import SidebarLayout from './layouts/SidebarLayout';
import AuthLayout from './layouts/AuthLayout';
import LoginPage from './pages/LoginPage';
import EmployeeListPage from './pages/Employees/EmployeeListPage';
import ImportEmployeesPage from './pages/Employees/ImportEmployeesPage';
import RegisterEmployeePage from './pages/Employees/RegisterEmployeePage';
import EmployeeDetailPage from './pages/Employees/EmployeeDetailPage';
import DepartmentListPage from './pages/Departments/DepartmentListPage';
import RegisterDepartmentPage from './pages/Departments/RegisterDepartmentPage';
import ImportDepartmentsPage from './pages/Departments/ImportDepartmentsPage';
import AwardListPage from './pages/Awards/AwardListPage';
import RegisterAwardPage from './pages/Awards/RegisterAwardPage';
import PositionListPage from './pages/Positions/PositionListPage';
import RegisterPositionPage from './pages/Positions/RegisterPositionPage';
import PerformanceEvaluationListPage from './pages/PerformanceEvaluations/PerformanceEvaluationListPage';
import RegisterPerformanceEvaluationPage from './pages/PerformanceEvaluations/RegisterPerformanceEvaluationPage';

const router = createHashRouter([
  {
    path: '/',
    element: <Navigate to="/login" />
  },
  {
    element: <AuthLayout />,
    children: [{ path: '/login', element: <LoginPage /> }]
  },
  {
    element: <SidebarLayout />,
    children: [
      {
        path: '/departments',
        children: [
          { index: true, element: <DepartmentListPage /> },
          { path: 'register', element: <RegisterDepartmentPage /> },
          { path: 'import', element: <ImportDepartmentsPage /> }
        ]
      },
      {
        path: '/employees',
        children: [
          { index: true, element: <EmployeeListPage /> },
          { path: 'import', element: <ImportEmployeesPage /> },
          { path: 'register', element: <RegisterEmployeePage /> },
          {
            path: ':id',
            children: [{ index: true, element: <EmployeeDetailPage /> }]
          }
        ]
      },
      {
        path: '/awards',
        children: [
          { index: true, element: <AwardListPage /> },
          { path: 'register', element: <RegisterAwardPage /> }
        ]
      },
      {
        path: '/positions',
        children: [
          { index: true, element: <PositionListPage /> },
          { path: 'register', element: <RegisterPositionPage /> }
        ]
      },
      {
        path: '/performance-evaluations',
        children: [
          { index: true, element: <PerformanceEvaluationListPage /> },
          { path: 'register', element: <RegisterPerformanceEvaluationPage /> }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/employees" />
  }
]);

export default router;
