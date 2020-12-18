import { Pane, PaneParams } from './Pane';
import React, { useContext } from 'react';
import { Colors } from '../constants/Colors';
import { InspectorContext } from '../InspectorContext';
import { ValidationReportIssue } from './ValidationReportIssue';
import styled from 'styled-components';

// == styles =======================================================================================
const Issues = styled.div`
  width: 100%;
`;

const Hr = styled.div`
  width: 100%;
  height: 2px;
  margin: 8px 0;
  background: ${ Colors.gray };
`;

const TooManyMessage = styled.div`
  font-weight: bold;
  margin: 8px;
`;

const Value = styled.span`
  font-weight: bold;
`;

const Line = styled.div`
  line-height: 20px;
`;

const Root = styled.div`
  padding: 8px;
  width: 480px;
  height: 320px;
  overflow-y: scroll;
  background: ${ Colors.uiBackground };
  backdrop-filter: blur( 5px );
  pointer-events: auto;
  resize: both;
`;

// == element ======================================================================================
export const ValidationReportPane = ( params: PaneParams ): JSX.Element => {
  const { inspector } = useContext( InspectorContext );
  const issues = inspector.validationReport?.issues;

  return (
    <Pane { ...params }>
      <Root>
        <Line>Validator Version:{ ' ' }
          <Value>{ inspector.validationReport?.validatorVersion }</Value>
        </Line>
        <Line>Errors:{ ' ' }
          <Value
            style={ { color: issues?.numErrors ? Colors.error : Colors.gray } }
          >{ issues?.numErrors }</Value>
        </Line>
        <Line>Warnings:{ ' ' }
          <Value
            style={ { color: issues?.numWarnings ? Colors.warning : Colors.gray } }
          >{ issues?.numWarnings }</Value>
        </Line>
        <Line>Infos:{ ' ' }
          <Value
            style={ { color: issues?.numInfos ? Colors.severityInfo : Colors.gray } }
          >{ issues?.numInfos }</Value>
        </Line>
        <Line>Hints:{ ' ' }
          <Value
            style={ { color: issues?.numHints ? Colors.severityInfo : Colors.gray } }
          >{ issues?.numHints }</Value>
        </Line>
        <Hr />
        { issues?.truncated && <TooManyMessage>
          There are too many issues! Showing only 100 entries.
        </TooManyMessage> }
        <Issues>
          { issues?.messages.map( ( issue, i ) => (
            <ValidationReportIssue
              key={ i }
              code={ issue.code }
              message={ issue.message }
              severity={ issue.severity }
              pointer={ issue.pointer }
            />
          ) ) }
        </Issues>
      </Root>
    </Pane>
  );
};
