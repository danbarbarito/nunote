import { Accessor, Component, Setter } from "solid-js";
import { Select, createOptions } from "@thisbeyond/solid-select";
import styles from "./TagsInput.module.css";

interface NoteCardProps {
  allTags: string[];
  tags?: string[];
  onChange?: (value: string[]) => any;
  existingOnly?: boolean;
  placeholder?: string;
}

const TagsInput: Component<NoteCardProps> = (props) => {
  const onChange = (inputValue: string[]) => {
    if (props.onChange) {
      props.onChange(inputValue);
    }
  };
  const optionsSettings: Record<any, any> = {};
  if (!props.existingOnly) {
    optionsSettings["createable"] = true;
  }
  const options = createOptions(props.allTags || [], optionsSettings);
  options.options;
  return (
    <Select
      class={styles.tagsInput}
      onChange={onChange}
      initialValue={props.tags || []}
      placeholder={props.placeholder || "Select tags..."}
      multiple
      {...options}
    />
  );
};

export default TagsInput;
