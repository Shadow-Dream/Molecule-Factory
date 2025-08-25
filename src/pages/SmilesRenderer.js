import { memo } from 'react';

import SvgRenderer from './SvgRenderer.js';

import { useMemo } from 'react';

import React from 'react';

export function ErrorRenderer(props) {
  const { width = 300, height = 150, value, error, ErrorComponent } = props;
  return (
    <div style={{ width, height }}>
      <ErrorComponent
        width={width}
        height={height}
        value={value}
        error={error}
      />
    </div>
  );
}

export function DefaultErrorRenderer(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width={props.width}
      height={props.height}
      viewBox="0 0 300 150"
    >
      <text x="0" y="2" fontSize="15" fill="rgb(255,0,0)">
        {props.message.split(/\r?\n/).map((line, i) => (
          <tspan key={i} x="0" dy={(i + 1) * 10}>
            {line}
          </tspan>
        ))}
      </text>
    </svg>
  );
}


export function useHandleMemoError(cb, deps) {
  const [hasError, result] = useMemo(() => {
    try {
      return [false, cb()];
    } catch (error) {
      return [true, error];
    }
  }, deps);

  return hasError ? [result, null] : [null, result];
}


function BaseSmilesSvgRenderer(props) {
  const {
    OCL,
    smiles,
    ErrorComponent = DefaultSmilesErrorComponent,
    ...otherProps
  } = props;
  const [error, mol] = useHandleMemoError(
    () => OCL.Molecule.fromSmiles(smiles),
    [OCL, smiles],
  );
  if (error) {
    return (
      <ErrorRenderer
        width={props.width}
        height={props.height}
        ErrorComponent={ErrorComponent}
        value={smiles}
        error={error}
      />
    );
  }
  return <SvgRenderer mol={mol} {...otherProps} />;
}

export default memo(BaseSmilesSvgRenderer);

function DefaultSmilesErrorComponent(props) {
  return (
    <DefaultErrorRenderer
      width={props.width}
      height={props.height}
      message="Invalid SMILES"
    />
  );
}
