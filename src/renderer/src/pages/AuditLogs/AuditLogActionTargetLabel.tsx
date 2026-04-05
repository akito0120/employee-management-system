import { Typography } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface AuditLogActionTargetLabelProps {
  target?: string;
}

const AuditLogActionTargetLabel = ({ target }: AuditLogActionTargetLabelProps) => {
  const { t } = useTranslation();
  const label = useMemo(() => {
    if (target === 'DEPARTMENT') return t('enums.actionTargets.department');
    else if (target === 'SUB_DEPARTMENT') return t('enums.actionTargets.subDepartment');
    else if (target === 'UNIT') return t('enums.actionTargets.unit');
    else if (target === 'POSITION') return t('enums.actionTargets.position');
    else if (target === 'EMPLOYEE') return t('enums.actionTargets.employee');
    else if (target === 'COMMENDATION') return t('enums.actionTargets.commendation');
    else if (target === 'PERFORMANCE_EVALUATION')
      return t('enums.actionTargets.performanceEvaluation');
    return null;
  }, [target, t]);

  return <Typography.Text>{label}</Typography.Text>;
};

export default AuditLogActionTargetLabel;
