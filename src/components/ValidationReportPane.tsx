import { Hr } from './Hr';
import { InspectorContext } from '../InspectorContext';
import { NameValueEntry } from './NameValueEntry';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { ValidationReportIssue } from './ValidationReportIssue';
import React, { useCallback, useContext, useReducer } from 'react';

// == microcomponents ==============================================================================
const ReportCount: React.FC<{
  count: number | undefined;
  colorClass: string;
}> = ( { count, colorClass } ) => <span
  className={ count ? colorClass : 'text-gray-500' }
>{ count }</span>;

// == element ======================================================================================
export const ValidationReportPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );
  const issues = inspector.gltfValidatorPlugin.validationReport?.issues;

  // increment this to force rerender 😇
  // used when click "See more"
  const [ _worstCount, inclWorstCount ] = useReducer( ( c ) => c + 1, 0 );

  const handleClickSeeMore = useCallback( () => {
    const maxIssues = 2 * issues!.messages.length;
    inspector.gltfValidatorPlugin.validate( maxIssues ).then( () => (
      inclWorstCount()
    ) );
  }, [ issues ] );

  return (
    <Pane { ...params }>
      <PaneRoot className="w-120 h-80 resize overflow-y-scroll">
        <NameValueEntry
          name="Validator Version"
          value={ inspector.gltfValidatorPlugin.validationReport?.validatorVersion }
        />
        <NameValueEntry
          name="Errors"
          value={ <ReportCount count={ issues?.numErrors } colorClass="text-red-500" /> }
        />
        <NameValueEntry
          name="Warnings"
          value={ <ReportCount count={ issues?.numWarnings } colorClass="text-yellow-300" /> }
        />
        <NameValueEntry
          name="Infos"
          value={ <ReportCount count={ issues?.numInfos } colorClass="text-sky-500" /> }
        />
        <NameValueEntry
          name="Hints"
          value={ <ReportCount count={ issues?.numHints } colorClass="text-sky-500" /> }
        />
        <Hr />
        { issues?.truncated && <div className="m-1 font-bold">
          There are too many issues! Showing only { issues?.messages.length } entries.
          <span
            onClick={ handleClickSeeMore }
            className="pl-2 text-sky-500 font-bold cursor-pointer"
          >
            See all
          </span>
        </div> }
        <div className="w-full font-mono leading-tight text-xs">
          { issues?.messages.map( ( issue, i ) => (
            <ValidationReportIssue
              key={ i }
              code={ issue.code }
              message={ issue.message }
              severity={ issue.severity }
              pointer={ issue.pointer }
            />
          ) ) }
        </div>
      </PaneRoot>
    </Pane>
  );
};
