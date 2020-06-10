import React from "react"
import { map } from "lodash"
import { Icon, List } from "antd"
import withLoader from "hoc/withLoader"

const WorkspaceList = ({ workspaces, onClick }) => (
  <List className="workspace-list" data-test="WorkspaceList">
    {map(workspaces, (workspace) => {
      return (
        <List.Item key={workspace.id} onClick={() => onClick(workspace)}>
          <span className="workspace-name">{workspace.name}</span>
          <div className="workspace-arrow">
            <Icon type="arrow-right" />
          </div>
        </List.Item>
      )
    })}
  </List>
)

const withLargeLoader = withLoader({
  size: "large",
  wrapperstyles: {
    textAlign: "center",
    marginTop: "40px",
    marginBottom: "40px",
  },
})

export default withLargeLoader(WorkspaceList)
