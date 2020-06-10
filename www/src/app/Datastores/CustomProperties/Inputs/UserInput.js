import React from "react"
import { Select } from "antd"
import { map } from "lodash"

const UserInput = ({ form, initialValue, field: { pk }, choices }) => (
  <>
    {form.getFieldDecorator(pk, {
      initialValue:
        initialValue && initialValue.hasOwnProperty("pk")
          ? initialValue.pk
          : null,
    })(
      <Select data-test={`CustomProperties.Input(${pk})`}>
        {map(choices, ({ pk, name }) => (
          <Select.Option key={pk} value={pk}>
            {name}
          </Select.Option>
        ))}
        <Select.Option key={""} value={""}>
          (reset this property)
        </Select.Option>
      </Select>
    )}
  </>
)

UserInput.defaultProps = {
  choices: [],
  initialValue: {
    pk: null,
  },
}

export default UserInput
