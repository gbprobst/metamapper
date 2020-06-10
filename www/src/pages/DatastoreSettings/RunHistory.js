import React, { Component } from "react"
import { compose } from "react-apollo"
import { Col, Drawer, Row } from "antd"
import moment from "moment"
import DatastoreLayout from "app/Datastores/DatastoreLayout"
import RunHistoryTable from "app/Datastores/RunHistory/RunHistoryTable"
import RunRevisionLog from "app/Datastores/RunHistory/RunRevisionLog"
import withGetDatastoreSettings from "graphql/withGetDatastoreSettings"
import withGetDatastoreRunHistory from "graphql/withGetDatastoreRunHistory"

const defaultDrawerProps = {
  className: "run-change-log",
  placement: "right",
  width: "85%",
}

class RunHistory extends Component {
  constructor(props) {
    super(props)

    this.breadcrumbs = this.breadcrumbs.bind(this)
    this.handleSelect = this.handleSelect.bind(this)

    this.state = {
      selectedRun: null,
      runDetailsVisible: false,
    }
  }

  handleSelect = (selectedRun) => {
    this.setState({ selectedRun, runDetailsVisible: true })
  }

  handleClose = () => {
    this.setState({ runDetailsVisible: false })
  }

  breadcrumbs(datastore) {
    const {
      currentWorkspace: { slug },
      match: {
        params: { datastoreSlug },
      },
    } = this.props

    return [
      {
        label: "Datastores",
        to: `/${slug}/datastores`,
      },
      {
        label: datastoreSlug,
        to: `/${slug}/datastores/${datastoreSlug}`,
      },
      {
        label: "Run History",
      },
    ]
  }


  renderTitle = (selectedRun) => {
    let title = "Revisions"
    if (selectedRun) {
      title += ` – ${moment(selectedRun.createdOn).format("MMMM Do, YYYY")}`
    }
    return title
  }

  render() {
    const { selectedRun, runDetailsVisible } = this.state
    const { datastore, runHistory, loading } = this.props
    return (
      <DatastoreLayout
        breadcrumbs={this.breadcrumbs}
        datastore={datastore}
        loading={loading}
        title={`Run History - ${datastore.slug} - Metamapper`}
      >
        <Row>
          <Col span={16} offset={4}>
            <RunHistoryTable runs={runHistory} onSelect={this.handleSelect} />
          </Col>
        </Row>
        <Drawer
          visible={runDetailsVisible}
          onClose={this.handleClose}
          title={this.renderTitle(selectedRun)}
          {...defaultDrawerProps}
        >
          <RunRevisionLog
            run={selectedRun}
            visible={runDetailsVisible}
            onClose={this.handleClose}
          />
        </Drawer>
      </DatastoreLayout>
    )
  }
}

const enhance = compose(withGetDatastoreSettings, withGetDatastoreRunHistory)

export default enhance(RunHistory)
