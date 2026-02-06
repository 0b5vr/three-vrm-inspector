import { Hr } from './Hr';
import { InspectorContext } from '../InspectorContext';
import { NameValueEntry } from './NameValueEntry';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { ValidationReportIssue } from './ValidationReportIssue';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ValidationReport } from '../inspector/plugins/ValidationReport';

type ValidationIssues = ValidationReport['issues'];

// == hooks ========================================================================================
function useValidator() {
  const { inspector } = useContext(InspectorContext);
  const [isValidating, setIsValidating] = useState(false);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);

  // Validate the model
  const validate = useCallback(async (maxIssues?: number) => {
    setIsValidating(true);
    await inspector.gltfValidatorPlugin.validate(maxIssues);
    setIsValidating(false);
    setValidationReport(inspector.gltfValidatorPlugin.validationReport);
  }, [inspector]);

  // Reset validation report when a new model is loaded
  useEffect(() => {
    const handleLoad = (): void => {
      setValidationReport(null);
      setIsValidating(false);
    };

    inspector.on('load', handleLoad);

    return () => {
      inspector.off('load', handleLoad);
    };
  }, [inspector]);

  return {
    validate,
    validationReport,
    isValidating,
  };
}

// == microcomponents ==============================================================================
function ReportCount({ count, colorClass }: {
  count: number | undefined;
  colorClass: string;
}) {
  return (
    <span
      className={count ? colorClass : 'text-gray-500'}
    >
      {count}
    </span>
  );
}

function ValidationIssuesList({ issues }: {
  issues: ValidationIssues | undefined;
}) {
  if (!issues || issues.messages.length === 0) {
    return null;
  }

  return (
    <div className="w-full font-mono leading-tight text-xs">
      {issues.messages.map((issue, i) => (
        <ValidationReportIssue
          key={i}
          code={issue.code}
          message={issue.message}
          severity={issue.severity}
          pointer={issue.pointer}
        />
      ))}
    </div>
  );
}

function TruncatedIssuesNotice({ issues, onSeeMore }: {
  issues: ValidationReport['issues'] | undefined;
  onSeeMore: () => void;
}) {
  if (!issues?.truncated) {
    return null;
  }

  return (
    <div className="m-1 font-bold">
      There are too many issues! Showing only
      {' '}
      {issues.messages.length}
      {' '}
      entries.
      <span
        onClick={onSeeMore}
        className="pl-2 text-sky-500 font-bold cursor-pointer"
      >
        See all
      </span>
    </div>
  );
}

// == element ======================================================================================
export function ValidationReportPane(params: PaneParams) {
  const { validate, validationReport, isValidating } = useValidator();
  const issues = validationReport?.issues;

  const handleClickValidate = useCallback(async () => {
    validate();
  }, [validate]);

  const handleClickSeeMore = useCallback(() => {
    const maxIssues = 2 * issues!.messages.length;
    validate(maxIssues);
  }, [validate, issues]);

  return (
    <Pane {...params}>
      <PaneRoot className="w-120 h-80 resize overflow-y-scroll">
        <NameValueEntry
          name="Validator Version"
          value={validationReport?.validatorVersion || '-'}
        />
        <NameValueEntry
          name="Errors"
          value={<ReportCount count={issues?.numErrors} colorClass="text-red-500" />}
        />
        <NameValueEntry
          name="Warnings"
          value={<ReportCount count={issues?.numWarnings} colorClass="text-yellow-300" />}
        />
        <NameValueEntry
          name="Infos"
          value={<ReportCount count={issues?.numInfos} colorClass="text-sky-500" />}
        />
        <NameValueEntry
          name="Hints"
          value={<ReportCount count={issues?.numHints} colorClass="text-sky-500" />}
        />
        <Hr />
        {isValidating
          ? (
              <div className="flex items-center justify-center py-4">
                <div className="text-gray-500">Validating...</div>
              </div>
            )
          : !validationReport
              ? (
                  <div className="flex items-center justify-center py-4">
                    <button
                      className="px-2 py-1 bg-gray-700 rounded"
                      onClick={handleClickValidate}
                    >
                      Validate
                    </button>
                  </div>
                )
              : (
                  <>
                    <TruncatedIssuesNotice
                      issues={issues}
                      onSeeMore={handleClickSeeMore}
                    />
                    <ValidationIssuesList issues={issues} />
                  </>
                )}
      </PaneRoot>
    </Pane>
  );
}
