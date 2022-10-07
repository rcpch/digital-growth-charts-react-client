import { Form, Select, Input } from "semantic-ui-react";

const boneAgeOptions = [
  { key: "gp", value: "greulich-pyle", text: "Greulich & Pyle" },
  {
    key: "twii",
    value: "tanner-whitehouse-ii",
    text: "Tanner Whitehouse II",
  },
  {
    key: "twiii",
    value: "tanner-whitehouse-iii",
    text: "Tanner Whitehouse III",
  },
  { key: "fels", value: "fels", text: "Fels" },
  { key: "bxpt", value: "bonexpert", text: "BoneXpert" },
];

function BoneAgeTypeSelect(props) {
  return (
    <>
      <Form.Group>
        <Form.Field style={{ textAlign: "left" }} width="16">
          <Input
            type="decimal"
            name="boneAge"
            placeholder="e.g. 3.5"
            labelPosition="right"
            label={{
              content: "years",
              basic: true,
              color: "black",
            }}
            value={props.boneAge}
            onChange={props.handleBoneAgeChange}
          />
        </Form.Field>
      </Form.Group>
      <Form.Group>
        <Form.Field style={{ textAlign: "left" }} width="8">
          <Input
            type="decimal"
            name="boneAgeSDS"
            placeholder="e.g. -3.5"
            labelPosition="right"
            label={{
              content: "SDS",
              basic: true,
              color: "black",
            }}
            value={props.boneAgeSDS}
            onChange={props.handleBoneAgeSDSChange}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: "left" }} width="8">
          <Input
            type="decimal"
            name="boneAgeCentile"
            placeholder="e.g. 50"
            labelPosition="right"
            label={{
              content: "centile",
              basic: true,
              color: "black",
            }}
            value={props.boneAgeCentile}
            onChange={props.handleBoneAgeCentileChange}
          />
        </Form.Field>
      </Form.Group>
      <Form.Group>
        <Form.Field style={{ textAlign: "left" }} width="16">
          <label>Comment</label>
          <Input
            type="text"
            name="boneAgeText"
            placeholder="e.g. This bone age is advanced"
            value={props.boneAgeText}
            onChange={props.handleBoneAgeTextChange}
          />
        </Form.Field>
      </Form.Group>
      <Form.Group>
        <Form.Field style={{ textAlign: "left" }} width="16">
          <label>Bone Age Reference</label>
          <Select
            name="boneagetype"
            placeholder="e.g. G&P"
            value={props.boneAgeType}
            onChange={(e, val) => props.handleChangeBoneAgeType(val)}
            options={boneAgeOptions}
          />
        </Form.Field>
      </Form.Group>
    </>
  );
}

export default BoneAgeTypeSelect;
