/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Slider
 */

import "./Slider.scss";
import classnames from "classnames";
import * as React from "react";
import {
  GetRailProps, GetTrackProps, Handles, Rail, Slider as CompoundSlider, SliderItem, SliderModeFunction, Ticks, Tracks,
} from "react-compound-slider";
import { BodyText } from "../text/BodyText";
import { CommonProps } from "../utils/Props";
import { Tooltip } from "../notification/Tooltip";

// cspell:ignore pushable

/** Properties for [[Slider]] component
 * @public
 */
export interface SliderProps extends CommonProps {
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Values to set Slider to initially */
  values: number[];

  /** Step value. Default is 0.1. */
  step?: number;
  /** The interaction mode. Default is 1. Possible values:
   * 1 - allows handles to cross each other.
   * 2 - keeps the sliders from crossing and separated by a step.
   * 3 - makes the handles pushable and keep them a step apart.
   * function - SliderModeFunction that will be passed the current values and the incoming update.
   *  Your function should return what the mode should be set as.
   */
  mode?: number | SliderModeFunction;

  /** Indicates whether the display of the Slider values is reversed. */
  reversed?: boolean;
  /** Indicates whether the Slider is disabled. */
  disabled?: boolean;
  /** Indicates whether to compensate for the tick marks when determining the width. */
  includeTicksInWidth?: boolean;

  /** Indicates whether to show tooltip with the value. The tooltip will be positioned above the Slider, by default. */
  showTooltip?: boolean;
  /** Indicates whether the tooltip should show below the Slider instead of above. */
  tooltipBelow?: boolean;
  /** Format a value for the tooltip */
  formatTooltip?: (value: number) => string;

  /** Indicates whether to show min & max values to the left & right of the Slider. */
  showMinMax?: boolean;
  /** Image to show for min. */
  minImage?: React.ReactNode;
  /** Image to show for max. */
  maxImage?: React.ReactNode;

  /** Indicates whether to show tick marks under the Slider. */
  showTicks?: boolean;
  /** Indicates whether to show tick labels under the tick marks. */
  showTickLabels?: boolean;
  /** Format a tick mark value */
  formatTick?: (tick: number) => string;
  /** Function to get the tick count. The default tick count is 10. */
  getTickCount?: () => number;
  /** Function to get the tick values. This overrides the tick count from getTickCount.
   * Use this prop if you want to specify your own tick values instead of ticks generated by the slider.
   * The numbers should be valid numbers in the domain and correspond to the step value.
   * Invalid values will be coerced to the closet matching value in the domain.
   */
  getTickValues?: () => number[];

  /** Listens for value changes.
   * Triggered when the value of the slider has changed. This will receive changes at
   * the end of a slide as well as changes from clicks on rails and tracks.
   */
  onChange?: (values: ReadonlyArray<number>) => void;
  /** Listens for value updates.
   *  Called with the values at each update (caution: high-volume updates when dragging).
   */
  onUpdate?: (values: ReadonlyArray<number>) => void;
  /** Function triggered with ontouchstart or onmousedown on a handle. */
  onSlideStart?: (values: ReadonlyArray<number>) => void;
  /** Function triggered on ontouchend or onmouseup on a handle. */
  onSlideEnd?: (values: ReadonlyArray<number>) => void;
}

/**
 * Slider React component displays a range slider.
 * The Slider component uses various components from the
 * [react-compound-slider](https://www.npmjs.com/package/react-compound-slider)
 * package internally.
 * @public
 */
export function Slider(props: SliderProps) {
  const { className, style, min, max, values, step, mode,
    onChange, onUpdate, onSlideStart, onSlideEnd,
    showTicks, showTickLabels, formatTick, getTickCount, getTickValues, includeTicksInWidth,
    reversed, disabled,
    showMinMax, minImage, maxImage,
    showTooltip, tooltipBelow, formatTooltip,
  } = props;
  const domain = [min, max];
  const multipleValues = values.length > 1;
  const containerClassNames = classnames(
    "core-slider-container",
    className,
    disabled && "core-disabled",
    showTickLabels && "core-slider-tickLabels",
    includeTicksInWidth && "core-slider-includeTicksInWidth",
  );
  const sliderClassNames = classnames(
    "core-slider",
    showMinMax && "core-slider-minMax",
  );

  return (
    <div className={containerClassNames} style={style}>
      {showMinMax &&
        <MinMax value={min} testId="core-slider-min" image={minImage} />
      }
      <CompoundSlider
        domain={domain}
        step={step}
        mode={mode}
        values={values}
        reversed={reversed}
        disabled={disabled}
        onChange={onChange}
        onUpdate={onUpdate}
        onSlideStart={onSlideStart}
        onSlideEnd={onSlideEnd}
        className={sliderClassNames}
        data-testid="core-slider"
      >
        <Rail>
          {({ getRailProps }) =>
            <Rails getRailProps={getRailProps} />
          }
        </Rail>
        <Tracks right={false} left={!multipleValues}>
          {({ tracks, activeHandleID, getEventData, getTrackProps }) => (
            <div className="slider-tracks">
              {tracks.map(({ id, source, target }) => (
                <TooltipTrack
                  key={id}
                  source={source}
                  target={target}
                  activeHandleID={activeHandleID}
                  getEventData={getEventData}
                  getTrackProps={getTrackProps}
                  showTooltip={showTooltip ?? true}
                  tooltipBelow={tooltipBelow}
                  formatTooltip={formatTooltip}
                  multipleValues={multipleValues}
                />
              ))}
            </div>
          )}
        </Tracks>
        {showTicks &&
          <Ticks values={getTickValues && getTickValues()} count={getTickCount && getTickCount()}>
            {({ ticks }) => (
              <div className="slider-ticks" data-testid="core-slider-ticks">
                {ticks.map((tick: any, index: number) => (
                  <Tick
                    key={tick.id}
                    tick={tick}
                    count={ticks.length}
                    index={index}
                    formatTick={formatTick}
                    showTickLabels={showTickLabels}
                  />
                ))}
              </div>
            )}
          </Ticks>
        }
        <Handles>
          {({ handles, activeHandleID, getHandleProps }) => (
            <div className="slider-handles">
              {handles.map((handle: SliderItem) => (
                <Handle
                  key={handle.id}
                  domain={domain}
                  handle={handle}
                  isActive={handle.id === activeHandleID}
                  getHandleProps={getHandleProps}
                  showTooltip={showTooltip}
                  tooltipBelow={tooltipBelow}
                  formatTooltip={formatTooltip}
                  disabled={disabled}
                />
              ))}
            </div>
          )}
        </Handles>
      </CompoundSlider>
      {showMinMax &&
        <MinMax value={max} testId="core-slider-max" image={maxImage} />
      }
    </div>
  );
}

/** Properties for [[MinMax]] component */
interface MinMaxProps {
  value: number;
  testId: string;
  image?: React.ReactNode;
}

/** MinMax component for Slider */
function MinMax(props: MinMaxProps) {
  const { value, testId, image } = props;
  let element: React.ReactElement<any>;

  if (image)
    element = <>{image}</>;
  else
    element = <BodyText data-testid={testId}>{value}</BodyText>;

  return element;
}

/** Properties for [[Rails]] component */
interface RailsProps {
  getRailProps: GetRailProps;
}

/** Rails component for Slider */
function Rails(props: RailsProps) {
  const { getRailProps } = props;

  return (
    <div className="core-slider-rail" {...getRailProps()}>
      <div className="core-slider-rail-inner" />
    </div>
  );
}

/** Properties for [[TooltipTrack]] component */
interface TooltipTrackProps {
  source: SliderItem;
  target: SliderItem;
  getTrackProps: GetTrackProps;
  activeHandleID: string;
  getEventData: (e: Event) => object;
  showTooltip?: boolean;
  tooltipBelow?: boolean;
  formatTooltip?: (value: number) => string;
  multipleValues?: boolean;
}

/** State for [[TooltipTrack]] component */
interface TooltipTrackState {
  percent: number | null;
}

/** TooltipTrack component for Slider */
function TooltipTrack(props: TooltipTrackProps) {
  const { source, target, activeHandleID, showTooltip, tooltipBelow,
    multipleValues, formatTooltip, getTrackProps, getEventData,
  } = props;

  const [percent, setPercent] = React.useState(null as number | null);

  // istanbul ignore next
  const _onPointerMove = (e: React.PointerEvent) => {
    if (activeHandleID) {
      setPercent(null);
    } else {
      const state = getEventData(e.nativeEvent) as TooltipTrackState;
      setPercent(state.percent);
    }
  };

  // istanbul ignore next
  const _onPointerLeave = () => {
    setPercent(null);
  };

  let tooltipText = "";
  if (multipleValues) {
    const sourceValue = formatTooltip ? formatTooltip(source.value) : source.value.toString();
    const targetValue = formatTooltip ? formatTooltip(target.value) : target.value.toString();
    tooltipText = `${sourceValue} : ${targetValue}`;
  }

  // istanbul ignore next
  return (
    <>
      {!activeHandleID && percent && showTooltip && multipleValues ? (
        <Tooltip percent={percent} below={tooltipBelow} value={tooltipText} />
      ) : null}
      <div className="core-slider-track" data-testid="core-slider-track"
        style={{ left: `${source.percent}%`, width: `${target.percent - source.percent}%` }}
        onPointerMove={_onPointerMove} onPointerLeave={_onPointerLeave}
        {...getTrackProps()}
      >
        <div className="core-slider-track-inner" />
      </div>
    </>
  );
}

/** Properties for [[Tick]] component */
interface TickProps {
  tick: SliderItem;
  count: number;
  index: number;
  formatTick?: (value: number) => string;
  showTickLabels?: boolean;
}

/** Tick component for Slider */
function Tick(props: TickProps) {
  const { tick, count, showTickLabels, formatTick } = props;
  return (
    <div>
      <div className="core-slider-tick-mark" style={{ left: `${tick.percent}%` }} />
      {showTickLabels &&
        <div className="core-slider-tick-label" style={{ marginLeft: `${-(100 / count) / 2}%`, width: `${100 / count}%`, left: `${tick.percent}%` }}>
          {formatTick !== undefined ? formatTick(tick.value) : tick.value}
        </div>
      }
    </div>
  );
}

/** Properties for [[Handle]] component */
interface HandleProps {
  key: string;
  handle: SliderItem;
  isActive: boolean;
  disabled?: boolean;
  domain: number[];
  getHandleProps: (id: string, config: object) => object;
  showTooltip?: boolean;
  tooltipBelow?: boolean;
  formatTooltip?: (value: number) => string;
}

/** Handle component for Slider */
function Handle(props: HandleProps) {
  const {
    domain: [min, max],
    handle: { id, value, percent },
    isActive,
    disabled,
    getHandleProps,
    showTooltip,
    tooltipBelow,
    formatTooltip,
  } = props;

  const [mouseOver, setMouseOver] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  // istanbul ignore next
  const _onMouseEnter = () => {
    setMouseOver(true);
  };

  // istanbul ignore next
  const _onMouseLeave = () => {
    setMouseOver(false);
  };

  // istanbul ignore next
  const _onFocus = () => {
    setFocused(true);
  };

  // istanbul ignore next
  const _onBlur = () => {
    setFocused(false);
  };

  // istanbul ignore next
  return (
    <>
      {(mouseOver || isActive || focused) && !disabled && showTooltip ? (
        <Tooltip percent={percent} below={tooltipBelow} value={formatTooltip ? formatTooltip(value) : value.toString()} />
      ) : null}
      <button
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className="core-slider-handle"
        data-testid="core-slider-handle"
        style={{ left: `${percent}%` }}
        {...getHandleProps(id, {
          onMouseEnter: _onMouseEnter,
          onMouseLeave: _onMouseLeave,
          onFocus: _onFocus,
          onBlur: _onBlur,
        })} />
    </>
  );
}
