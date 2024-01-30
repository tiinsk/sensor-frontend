import React from 'react';
import styled from 'styled-components';

import { Button } from '../buttons';

import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import { SelectContext } from './select-context';
import { Caption2Light } from '../typography';
import { Option } from './option';

interface SelectProps {
  label?: string;
  onSelect: (value: string) => void;
  initialValue?: string;
  options: { value: string; label: string }[];
}

export const SelectWrapper = styled.div`
  position: relative;
  width: fit-content;
`;

export const StyledSelect = styled(Button)`
  min-width: ${({ theme }) => theme.spacings.s96};
  justify-content: space-between;
`;

export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  outline: 0;
  width: 100%;
  z-index: 1;

  background-color: ${({ theme }) => theme.colors.buttons.background.secondary};
  border-radius: ${({ theme }) => theme.spacings.s4};
`;

/*
 * This component is based on Floating UI (https://floating-ui.com/docs/FloatingList) example.
 * Example: https://codesandbox.io/p/sandbox/floating-ui-react-select-with-composable-children-qsuw76?file=%2Fsrc%2FApp.tsx
 * */

export const Select = ({
  label,
  onSelect,
  options,
  initialValue,
}: SelectProps) => {
  const initialSelectedIndex = options.findIndex(
    option => option.value === initialValue
  );

  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(
    initialSelectedIndex > -1 ? initialSelectedIndex : null
  );

  const selectedLabel =
    selectedIndex !== null ? options[selectedIndex].label : null;

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [flip(), offset(5)],
  });

  const elementsRef = React.useRef<Array<HTMLElement | null>>([]);
  const labelsRef = React.useRef<Array<string | null>>([]);

  const handleSelect = React.useCallback(
    (index: number | null, value: string | null) => {
      setSelectedIndex(index);
      setIsOpen(false);
      if (value !== null) {
        onSelect(value);
      }
    },
    [onSelect]
  );

  const handleTypeaheadMatch = (index: number | null) => {
    if (isOpen) {
      setActiveIndex(index);
    }
  };

  const listNav = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex,
    onMatch: handleTypeaheadMatch,
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'listbox' });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [listNav, typeahead, click, dismiss, role]
  );

  const selectContext = React.useMemo(
    () => ({
      activeIndex,
      selectedIndex,
      getItemProps,
      handleSelect,
    }),
    [activeIndex, selectedIndex, getItemProps, handleSelect]
  );

  return (
    <SelectWrapper>
      {label && <Caption2Light mb="s8">{label}</Caption2Light>}
      <StyledSelect
        variant="secondary"
        sizeVariant="small"
        buttonRef={refs.setReference}
        tabIndex={0}
        {...getReferenceProps()}
        text={selectedLabel ?? 'Select...'}
        iconRight={isOpen ? 'mdiChevronUp' : 'mdiChevronDown'}
      />
      <SelectContext.Provider value={selectContext}>
        {isOpen && (
          <FloatingFocusManager context={context} modal={false}>
            <OptionList
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
            >
              <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
                {options.map(option => (
                  <Option
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </FloatingList>
            </OptionList>
          </FloatingFocusManager>
        )}
      </SelectContext.Provider>
    </SelectWrapper>
  );
};
