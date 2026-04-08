import '@xyflow/react/dist/style.css';

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import AdminGuard from '@renderer/components/AdminGuard';
import { useInstitutionName } from '@renderer/hooks/metadata';
import { themeAtom } from '@renderer/hooks/theme';
import { trpc } from '@renderer/trpc';
import {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Edge,
  Handle,
  MiniMap,
  Node,
  NodeProps,
  Panel,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState
} from '@xyflow/react';
import { App, Breadcrumb, Button, Card, Modal, Space, Typography } from 'antd';
import dagre from 'dagre';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import DepartmentForm from '../Departments/DepartmentForm';
import SubDepartmentForm from '../SubDepartments/SubDepartmentForm';
import UnitForm from '../Units/UnitForm';

type OrgNodeData = {
  id: number;
  type: 'DEPARTMENT' | 'SUB_DEPARTMENT' | 'UNIT' | 'INSTITUTION';
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  parentId: number | null;
  name: string;
  description: string | null;
  code: string;
};

type OrgNodeType = Node<OrgNodeData, 'orgNode'>;

const nodeWidth = 200;
const nodeHeight = 100;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 100,
    ranksep: 100
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2
      }
    };
  });

  return { nodes: layoutedNodes, edges };
};

const OrgNode = ({ data }: NodeProps<OrgNodeType>) => {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const { refetch } = trpc.departments.findAll.useQuery();

  const { message } = App.useApp();
  const { t } = useTranslation();
  const onError = () => message.error(t('global.somethingWentWrongMsg'));

  const { mutateAsync: deleteDept } = trpc.departments.deleteDepartmentById.useMutation({
    onError
  });
  const { mutateAsync: deleteSubDept } = trpc.subDepartments.deleteSubDepartmentById.useMutation({
    onError
  });
  const { mutateAsync: deleteUnit } = trpc.units.deleteUnitById.useMutation({ onError });

  const deleteOrg = async () => {
    if (data.type === 'DEPARTMENT') await deleteDept(data.id);
    else if (data.type === 'SUB_DEPARTMENT') await deleteSubDept(data.id);
    else if (data.type === 'UNIT') await deleteUnit(data.id);
    refetch();
  };

  const onAddSuccess = () => {
    refetch();
    setAddOpen(false);
  };

  const onAddCancel = () => {
    setAddOpen(false);
  };

  const onEditSuccess = () => {
    refetch();
    setEditOpen(false);
  };

  const onEditCancel = () => {
    setEditOpen(false);
  };

  return (
    <Card
      style={{
        borderRadius: '2px',
        textAlign: 'center',
        position: 'relative',
        width: nodeWidth,
        height: nodeHeight,
        cursor: 'pointer'
      }}
      styles={{
        body: {
          padding: '1rem',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }
      }}
    >
      {data.type !== 'INSTITUTION' && (
        <Handle type="target" position={Position.Top} isConnectable={false} />
      )}

      <Typography.Text strong>{data.name}</Typography.Text>

      <AdminGuard>
        <Space.Compact
          style={{
            position: 'absolute',
            bottom: '-15px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10
          }}
        >
          {data.type !== 'INSTITUTION' && (
            <Button
              onClick={() => setEditOpen(true)}
              icon={<EditOutlined />}
              size="small"
              variant="filled"
              color="primary"
            />
          )}
          {data.type !== 'UNIT' && (
            <Button
              onClick={() => setAddOpen(true)}
              icon={<PlusOutlined />}
              size="small"
              variant="filled"
              color="primary"
            />
          )}
          {data.type !== 'INSTITUTION' && (
            <Button
              onClick={deleteOrg}
              icon={<DeleteOutlined />}
              size="small"
              variant="filled"
              color="primary"
            />
          )}
        </Space.Compact>
      </AdminGuard>

      {data.type !== 'UNIT' && (
        <Handle type="source" position={Position.Bottom} isConnectable={false} />
      )}

      <Modal
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        footer={null}
        width={1000}
        styles={{ body: { padding: '1rem' } }}
        title={t('global.edit')}
      >
        {data.type === 'DEPARTMENT' && (
          <DepartmentForm
            editing
            onCancel={onEditCancel}
            onSuccess={onEditSuccess}
            department={data}
          />
        )}

        {data.type === 'SUB_DEPARTMENT' && (
          <SubDepartmentForm
            editing
            onCancel={onEditCancel}
            onSuccess={onEditSuccess}
            subDepartment={{ ...data, departmentId: data.parentId as number }}
          />
        )}

        {data.type === 'UNIT' && (
          <UnitForm
            editing
            onCancel={onEditCancel}
            onSuccess={onEditSuccess}
            unit={{ ...data, subDepartmentId: data.parentId as number }}
          />
        )}
      </Modal>

      <Modal
        open={addOpen}
        onCancel={() => setAddOpen(false)}
        footer={null}
        width={1000}
        styles={{ body: { padding: '1rem' } }}
        title={t('global.add')}
      >
        {data.type === 'INSTITUTION' && (
          <DepartmentForm editing onCancel={onAddCancel} onSuccess={onAddSuccess} />
        )}

        {data.type === 'DEPARTMENT' && (
          <SubDepartmentForm
            editing
            onCancel={onAddCancel}
            onSuccess={onAddSuccess}
            fixedParentId={data.id}
          />
        )}

        {data.type === 'SUB_DEPARTMENT' && (
          <UnitForm
            editing
            onCancel={onAddCancel}
            onSuccess={onAddSuccess}
            fixedParentId={data.id}
          />
        )}
      </Modal>
    </Card>
  );
};

const nodeTypes = {
  orgNode: OrgNode
};

const OrganizationEditor = () => {
  const { data } = trpc.departments.findAll.useQuery();
  const [institutionName] = useInstitutionName();

  const initialNodes = useMemo(
    () =>
      data
        ? [
            ...data.map((unit) => {
              return {
                id: unit.id.toString(),
                type: 'orgNode',
                position: { x: 0, y: 0 },
                data: unit
              };
            }),
            {
              id: 'institution',
              type: 'orgNode',
              data: { name: institutionName, type: 'INSTITUTION' }
            }
          ]
        : [],
    [data, institutionName]
  );

  const initialEdges = useMemo(
    () =>
      data
        ? data.map((unit) => ({
            id: unit.parentId ? `e-${unit.parentId}-${unit.id}` : `e-institution-${unit.id}`,
            source: unit.parentId == null ? 'institution' : unit.parentId.toString(),
            target: unit.id.toString(),
            type: ConnectionLineType.SmoothStep
          }))
        : [],
    [data]
  );

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(initialNodes as Node[], initialEdges),
    [initialNodes, initialEdges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges, setNodes, setEdges]);

  const theme = useAtomValue(themeAtom);
  const { t } = useTranslation();

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#FCFCFC' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesDraggable={false}
        fitView
        nodeTypes={nodeTypes}
        colorMode={theme === 'light' ? 'light' : 'dark'}
      >
        <Background color="#AAA" variant={BackgroundVariant.Dots} />
        <MiniMap position="bottom-left" />
        <Panel position="top-left" style={{ padding: '1rem' }}>
          <Breadcrumb items={[{ title: t('sidebar.organizationEditor') }]} />
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default OrganizationEditor;
