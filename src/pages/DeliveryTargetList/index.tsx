import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'dva';
import { Pagination } from '@b-design/ui';
import ListTitle from '../../components/ListTitle';
import TableList from './components/List';
import DeliveryDialog from './components/DeliveryDialog';
import { DeliveryTarget } from '../../interface/deliveryTarget';
import './index.less';
import { Cluster } from '../../interface/cluster';

type Props = {
  deliveryTargets?: [];
  total?: number;
  clusterList?: Array<Cluster>;
  namespaceList?: [];
  dispatch: ({}) => {};
  t: (key: string) => {};
};

type State = {
  page: number;
  pageSize: number;
  query: string;
  showAddTarget: boolean;
  editTargetName: string;
  visibleDelivery: boolean;
  isEdit: boolean;
  deliveryTargetItem?: DeliveryTarget;
};

@connect((store: any) => {
  return { ...store.deliveryTarget, ...store.application, ...store.clusters };
})
class DeliveryTargetList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      query: '',
      page: 0,
      pageSize: 10,
      showAddTarget: false,
      editTargetName: '',
      visibleDelivery: false,
      isEdit: false,
    };
  }

  componentDidMount() {
    this.getDeliveryTargetList();
    this.getClusterList();
    this.getNamespaceList();
  }

  getDeliveryTargetList = async () => {
    const { page, pageSize, query } = this.state;
    this.props.dispatch({
      type: 'deliveryTarget/listDeliveryTarget',
      payload: {
        query,
        page,
        pageSize,
      },
    });
  };

  getClusterList = async () => {
    this.props.dispatch({
      type: 'clusters/getClusterList',
    });
  };

  getNamespaceList = async () => {
    this.props.dispatch({
      type: 'application/getNamespaceList',
      payload: {},
    });
  };

  updateDeliveryTargetList = () => {
    this.setState(
      {
        query: '',
        page: 0,
        pageSize: 10,
      },
      () => {
        this.getDeliveryTargetList();
      },
    );
  };

  changeISEdit = (isEdit: boolean, record: DeliveryTarget) => {
    this.setState({
      isEdit,
      visibleDelivery: true,
      deliveryTargetItem: record,
    });
  };

  onClose = () => {
    this.setState({ visibleDelivery: false, isEdit: false });
  };

  onOk = () => {
    this.getDeliveryTargetList();
    this.setState({
      isEdit: false,
    });
  };

  handleChange = (page: number) => {
    this.setState({
      page,
      pageSize: 10,
    });
  };

  render() {
    const { t, clusterList, deliveryTargets, total, namespaceList, dispatch } = this.props;
    const { visibleDelivery, isEdit, deliveryTargetItem } = this.state;
    console.log('this.total', total);
    return (
      <div>
        <ListTitle
          title="Delivery Target Manager"
          subTitle="Define the delivery target for an application"
          addButtonTitle="Add DeliveryTarget"
          addButtonClick={() => {
            this.setState({ visibleDelivery: true, deliveryTargetItem: undefined });
          }}
        />

        <TableList
          list={deliveryTargets}
          updateDeliveryTargetList={this.updateDeliveryTargetList}
          changeISEdit={(isEdit: boolean, record: DeliveryTarget) => {
            this.changeISEdit(isEdit, record);
          }}
        />

        <Pagination
          className="delivery-target-pagenation"
          total={total}
          size="medium"
          pageSize={this.state.pageSize}
          current={this.state.page}
          onChange={this.handleChange}
        />

        <DeliveryDialog
          t={t}
          visible={visibleDelivery}
          clusterList={clusterList}
          namespaceList={namespaceList}
          isEdit={isEdit}
          deliveryTargetItem={deliveryTargetItem}
          onClose={this.onClose}
          onOK={this.onOk}
          dispatch={dispatch}
        />
      </div>
    );
  }
}

export default withTranslation()(DeliveryTargetList);
