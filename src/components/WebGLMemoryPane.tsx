import { Hr } from './Hr';
import { NameValueEntry } from './NameValueEntry';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { bytesToDisplayBytes } from './utils/bytesToDisplayBytes';
import { useAtomValue } from 'jotai';
import { webglMemoryInfoAtom } from '../stores/atoms/webglMemoryInfoAtom';

// == element ======================================================================================
export const WebGLMemoryPane = ( params: PaneParams ): JSX.Element => {
  const info = useAtomValue( webglMemoryInfoAtom );

  return (
    <Pane { ...params }>
      <PaneRoot>
        <NameValueEntry name="Buffer" value={ bytesToDisplayBytes( info?.memory?.buffer ?? 0.0 ) } />
        <NameValueEntry name="Texture" value={ bytesToDisplayBytes( info?.memory?.texture ?? 0.0 ) } />
        <NameValueEntry name="Render Buffer" value={ bytesToDisplayBytes( info?.memory?.renderbuffer ?? 0.0 ) } />
        <NameValueEntry name="Drawing Buffer" value={ bytesToDisplayBytes( info?.memory?.drawingbuffer ?? 0.0 ) } />
        <NameValueEntry name="Total" value={ bytesToDisplayBytes( info?.memory?.total ?? 0.0 ) } />
        <Hr />
        <NameValueEntry name="Buffer" value={ info?.resources?.buffer ?? 0 } />
        <NameValueEntry name="Render Buffer" value={ info?.resources?.renderbuffer ?? 0 } />
        <NameValueEntry name="Program" value={ info?.resources?.program ?? 0 } />
        <NameValueEntry name="Query" value={ info?.resources?.query ?? 0 } />
        <NameValueEntry name="Sampler" value={ info?.resources?.sampler ?? 0 } />
        <NameValueEntry name="Shader" value={ info?.resources?.shader ?? 0 } />
        <NameValueEntry name="Sync" value={ info?.resources?.sync ?? 0 } />
        <NameValueEntry name="Texture" value={ info?.resources?.texture ?? 0 } />
        <NameValueEntry name="Transform Feedback" value={ info?.resources?.transformFeedback ?? 0 } />
        <NameValueEntry name="Vertex Array" value={ info?.resources?.vertexArray ?? 0 } />
      </PaneRoot>
    </Pane>
  );
};
