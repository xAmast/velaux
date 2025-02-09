import React, { Component } from 'react';
import { connect } from 'dva';
import { Tab, Grid } from '@b-design/ui';
import './index.less';
import Translation from '../../../../components/Translation';
import { ApplicationDetail, EnvBinding } from '../../../../interface/application';
import { If } from 'tsx-control-statements/components';
import AddEnvBind from '../AddEnvBind';
import { Link } from 'dva/router';

const { Row, Col } = Grid;
type Props = {
  activeKey: string;
  applicationDetail?: ApplicationDetail;
  dispatch: ({}) => {};
  envbinding?: Array<EnvBinding>;
};

type State = {
  visibleEnvPlan: boolean;
};

@connect((store: any) => {
  return { ...store.application };
})
class TabsContent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      visibleEnvPlan: false,
    };
  }

  handleChange = (key: string | number) => {};
  loadEnvbinding = async () => {
    const { applicationDetail } = this.props;
    if (applicationDetail) {
      this.props.dispatch({
        type: 'application/getApplicationEnvbinding',
        payload: { appName: applicationDetail.name },
      });
    }
  };
  render() {
    const { activeKey, applicationDetail, envbinding } = this.props;
    const { visibleEnvPlan } = this.state;
    return (
      <div className="padding16">
        <div className="tabs-content">
          <Row className="tabs-wraper">
            <Col span={20}>
              <Tab shape="wrapped" size="small" activeKey={activeKey} onChange={this.handleChange}>
                <Tab.Item
                  title={
                    <Link to={`/applications/${applicationDetail?.name}/config`}>
                      <Translation>Benchmark Config</Translation>
                    </Link>
                  }
                  key={'basisConfig'}
                ></Tab.Item>
                {envbinding?.map((item) => {
                  return (
                    <Tab.Item
                      title={
                        <Link
                          to={`/applications/${applicationDetail?.name}/envbinding/${item.name}/instances`}
                        >
                          <span title={item.description}>
                            {item.alias ? item.alias : item.name}
                          </span>
                        </Link>
                      }
                      key={item.name}
                    ></Tab.Item>
                  );
                })}
              </Tab>
            </Col>
            <Col span={4}>
              <div className="action-list">
                <a
                  onClick={() => {
                    this.setState({ visibleEnvPlan: true });
                  }}
                >
                  <Translation>Add Environment</Translation>
                </a>
              </div>
            </Col>
          </Row>
        </div>
        <If condition={visibleEnvPlan}>
          <AddEnvBind
            onClose={() => {
              this.setState({ visibleEnvPlan: false });
            }}
            onOK={() => {
              this.loadEnvbinding();
              this.setState({ visibleEnvPlan: false });
            }}
          ></AddEnvBind>
        </If>
      </div>
    );
  }
}

export default TabsContent;
