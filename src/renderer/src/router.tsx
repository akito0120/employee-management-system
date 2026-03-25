import { createHashRouter, Navigate } from 'react-router-dom';

import AuthLayout from './layouts/AuthLayout';
import SidebarLayout from './layouts/SidebarLayout';
import DepartmentListPage from './pages/Departments/DepartmentListPage';
import RegisterDepartmentPage from './pages/Departments/RegisterDepartmentPage';
import EmployeeDetailPage from './pages/Employees/EmployeeDetailPage';
import EmployeeListPage from './pages/Employees/EmployeeListPage';
import ImportEmployeesPage from './pages/Employees/ImportEmployeesPage';
import RegisterEmployeePage from './pages/Employees/RegisterEmployeePage';
import LoginPage from './pages/LoginPage';
import PerformanceEvaluationListPage from './pages/PerformanceEvaluations/PerformanceEvaluationListPage';
import RegisterPerformanceEvaluationPage from './pages/PerformanceEvaluations/RegisterPerformanceEvaluationPage';
import PositionListPage from './pages/Positions/PositionListPage';
import RegisterPositionPage from './pages/Positions/RegisterPositionPage';
import RegisterRewardPage from './pages/Rewards/RegisterRewardPage';
import RewardListPage from './pages/Rewards/RewardListPage';
import RegisterSubDepartmentPage from './pages/SubDepartments/RegisterSubDepartmentPage';
import SubDepartmentListPage from './pages/SubDepartments/SubDepartmentListPage';
import RegisterUnitPage from './pages/Units/RegisterUnitPage';
import UnitListPage from './pages/Units/UnitListPage';

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
          { path: 'register', element: <RegisterDepartmentPage /> }
        ]
      },
      {
        path: '/sub-departments',
        children: [
          { index: true, element: <SubDepartmentListPage /> },
          { path: 'register', element: <RegisterSubDepartmentPage /> }
        ]
      },
      {
        path: '/units',
        children: [
          { index: true, element: <UnitListPage /> },
          { path: 'register', element: <RegisterUnitPage /> }
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
        path: '/rewards',
        children: [
          { index: true, element: <RewardListPage /> },
          { path: 'register', element: <RegisterRewardPage /> }
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
