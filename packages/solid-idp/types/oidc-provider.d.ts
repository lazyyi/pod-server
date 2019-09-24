declare module 'oidc-provider' {

  /** Declaration file generated by dts-gen */
  import { IncomingMessage, ServerResponse } from "http";
  import { Http2ServerRequest, Http2ServerResponse } from "http2";
  import { EventEmitter } from "events";
  import Keygrip from 'keygrip';
  import { callbackPromise } from "nodemailer/lib/shared";
  import { Context } from "koa";
  import { GotOptions } from "got";

  export = Provider;

  // TODO: this is possibly a bad definition for middleware
  type routerMiddleware = (ctx: Context, next: () => Promise<any>) => Promise<void>

  class Provider extends EventEmitter {
    proxy: boolean
    constructor(issuer: string, config?: Provider.ProviderConfiguration);
    cookieName(name: string): string;
    interactionDetails(req: IncomingMessage | Http2ServerRequest): Promise<Provider.Session>;
    // TODO: provide a type for the configuration of interaction finished and check to be sur
    interactionFinished(req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse, result: Provider.InteractionResult): Promise<void>;
    interactionResult(req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse, result: Provider.InteractionResult): Promise<string>;
    listen(port: number, callback: () => void): void;
    // TODO: figure out the type for options
    pathFor(name: string, options?: {}): string;
    registerGrantType(
      grantType: string,
      tokenExchangeHandler: routerMiddleware,
      parameters: string[],
      allowedDuplicateParameters: string[]
    ): void;
    // TODO: figure out the type for payload (if any)
    registerResponseMode(name: string, handler: (req: IncomingMessage | Http2ServerRequest, redirectUri: string, payload: {}) => void): void;
    setProviderSession(req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse, session: {
      account: string,
      ts: number,
      remember: boolean,
      clients: string[],
      meta: { [clientId: string]: {} }
    }): void;
    // TODO: figure out the type for options (same as pathFor)
    urlFor(name: string, options?: {}): void;
    use(...middleware: routerMiddleware[]): void;
    callback(eq: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse, next: Promise<any>): Promise<void>
  }

  namespace Provider {

    type SubjectType = "public" | "parwise";
    type AuthMethod = | "none" | "client_secret_basic" | "client_secret_post" | "client_secret_jwt" | "private_key_jwt" | "tls_client_auth" | "self_signed_tls_client_auth";
    type EncryptionAlgValue = | "RSA-OAEP" | "RSA1_5" | "ECDH-ES" | "ECDH-ES+A128KW" | "ECDH-ES+A192KW" | "ECDH-ES+A256KW" | "A128KW" | "A192KW" | "A256KW" | "A128GCMKW" | "A192GCMKW" | "A256GCMKW" | "PBES2-HS256+A128KW" | "PBES2-HS384+A192KW" | "PBES2-HS512+A256KW";
    type EncryptionEncValue = | "A128CBC-HS256" | "A128GCM" | "A192CBC-HS384" | "A192GCM" | "A256CBC-HS512" | "A256GCM";
    type SigningAlgValue = | "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "PS256" | "PS384" | "PS512" | "ES256" | "ES384" | "ES512";
    type OptionalSigningAlgValue = SigningAlgValue | "none";
    type Use = "sig" | "enc";

    interface RsaKeyBasic {
      kty: 'RSA';
      e: string;
      n: string;
      use?: Use;
      kid?: string;
      alg?: string;
    }

    interface EcKeyBasic {
      kty: 'EC';
      crv: string;
      x: string;
      y: string;
      use?: Use;
      kid?: string;
      alg?: string;
    }

    interface RsaKey extends RsaKeyBasic {
      d: string;
      dp: string;
      dq: string;
      p: string;
      q: string;
      qi: string;
    }

    interface EcKey extends EcKeyBasic {
      d: string;
    }

    // TODO: I don't think this is a comprehensive set of what could  e a JWKSet
    interface JWKSet {
      keys: RsaKeyBasic | EcKeyBasic | RsaKey | EcKey
    }

    interface Adapter {
      name: string
      upsert(id: string, payload: { [key: string]: string }, expiresIn: number): Promise<void>
      find(id: string): Promise<{}>
      findByUserCode(userCode: string): Promise<{ [key: string]: string }>
      findByUid(uid: string): Promise<{ [key: string]: string }>
      consume(id: string): Promise<void>
      destroy(id: string): Promise<void>
      revokeByGrantId(grantId: string): Promise<void>
    }

    interface Account {
      accountId: string
      claims: (use: 'id_token' | 'userinfo', scope: string, claims: Object, rejected: string[]) => Promise<{ sub: string, [key: string]: any }>
    }

    interface Client {
      application_type?: "web" | "native";
      authorization_encrypted_response_alg?: EncryptionAlgValue;
      authorization_encrypted_response_enc?: EncryptionEncValue;
      authorization_signed_response_alg?: SigningAlgValue;
      backchannel_logout_session_required?: boolean;
      backchannel_logout_uri?: string;
      client_id: string;
      client_name?: string;
      client_secret?: string;
      default_acr_values?: string[];
      default_max_age?: number;
      frontchannel_logout_session_required?: boolean;
      frontchannel_logout_uri?: string;
      grant_types: string[];
      id_token_encrypted_response_alg?: EncryptionAlgValue;
      id_token_encrypted_response_enc?: EncryptionEncValue;
      id_token_signed_response_alg?: SigningAlgValue;
      initiate_login_uri?: string;
      introspection_encrypted_response_alg?: EncryptionAlgValue;
      introspection_encrypted_response_enc?: EncryptionEncValue;
      introspection_endpoint_auth_method?: AuthMethod;
      introspection_endpoint_auth_signing_alg?: SigningAlgValue;
      introspection_signed_response_alg?: SigningAlgValue;
      jwks?: {
        keys: (RsaKeyBasic | EcKeyBasic)[]
      };
      jwks_uri?: string;
      logo_uri?: string;
      policy_uri?: string;
      post_logout_redirect_uris?: string[];
      request_object_encryption_alg?: EncryptionAlgValue;
      request_object_encryption_enc?: EncryptionEncValue;
      request_object_signing_alg?: SigningAlgValue;
      redirect_uris: string[];
      request_uris?: string[];
      require_auth_time?: boolean;
      response_types: string[];
      revocation_endpoint_auth_method?: AuthMethod;
      revocation_endpoint_auth_signing_alg?: SigningAlgValue;
      scope: string[]
      sector_identifier_uri?: string;
      subject_type?: SubjectType;
      tls_client_auth_san_dns?: string;
      tls_client_auth_san_email?: string;
      tls_client_auth_san_ip?: string;
      tls_client_auth_san_uri?: string;
      tls_client_auth_subject_dn?: string;
      tls_client_certificate_bound_access_tokens?: boolean;
      token_endpoint_auth_method?: AuthMethod;
      token_endpoint_auth_signing_alg?: SigningAlgValue;
      tos_uri?: string;
      userinfo_encrypted_response_alg?: EncryptionAlgValue;
      userinfo_encrypted_response_enc?: EncryptionEncValue;
      userinfo_signed_response_alg?: SigningAlgValue;
      web_message_uris?: string[];
    }

    interface FeatureConfiguration {
      enabled?: boolean,
      ack?: number
    }


    interface ProviderConfiguration {
      adapter?: new (name: string) => Adapter
      clients?: Client[]
      findAccount?: (ctx: Context, sub: string, token?: string) => Promise<Account>
      jwks?: JWKSet
      features?: {
        backchannelLogout?: FeatureConfiguration
        claimsParameter?: FeatureConfiguration
        clientCredentials?: FeatureConfiguration
        dPoP?: {
          enabled?: boolean
          ack?: number
          iatTolerance?: number
        }
        dangerouslyEnableLocalhost?: boolean
        devInteractions?: FeatureConfiguration
        deviceFlow?: {
          charset?: 'base-20' | 'digits'
          deviceInfo?: (ctx: Context) => { ip: string, ua: string }
          mask?: string
          successSource?: (ctx: Context) => Promise<void>
          // TODO outline device info parameter
          userCodeConfirmSource?: (ctx: Context, form: string, client: Client, deviceInfo: {}, userCode: string) => Promise<void>
          userCodeInputSource?: (ctx: Context, form: string, out: { [key: string]: string }, err: Error) => Promise<void>
        }
        encryption?: FeatureConfiguration
        frontchannelLogout?: {
          enabled?: boolean
          ack?: number
          logoutPendingSource?: (ctx: Context, frames: string[], postLogoutRedirectUri: string) => Promise<void>
        }
        introspection?: FeatureConfiguration
        jwtIntrospection?: FeatureConfiguration
        jwtResponseModes?: FeatureConfiguration
        jwtUserinfo?: FeatureConfiguration
        mTLS?: {
          enabled?: boolean
          certificateAuthorized?: (ctx: Context) => Promise<boolean>
          certificateBoundAccessTokens?: boolean
          certificateSubjectMatches?: (ctx: Context, property: string, expected: string) => Promise<boolean>
          getCertificate?: (ctx: Context) => Promise<string>
          selfSignedTlsClientAuth?: boolean
          tlsClientAuth?: boolean
        }
        registration?: {
          enabled?: boolean
          idFactory?: () => Promise<string>
          initialAccessToken?: boolean
          policies?: {
            [key: string]: (ctx: Context, properties: Client) => Promise<void>
          }
          secretFactory?: () => Promise<string>
        }
        registrationManagement?: {
          enabled?: boolean
          rotateRegistrationAccessToken?: (ctx: Context) => Promise<string>
        }
        request?: FeatureConfiguration
        requestUri?: {
          enabled?: boolean
          requireUriRegistration?: boolean
        }
        resourceIndicator?: FeatureConfiguration
        revocation?: FeatureConfiguration
        sessionManagement?: {
          enabled?: boolean
          keepHeaders?: boolean
        }
        userInfo?: FeatureConfiguration
        webMessageResponseMode?: FeatureConfiguration
      }
      acrValues?: string[]
      audiences?: (ctx: Context, sub: string, token: string, use: 'access_token' | 'client_credentials') => boolean | undefined | string[]
      claims?: { [claim: string]: string[] } | string[]
      clientBasedCORS?: (ctx: Context, origin: string, client: Client) => Promise<boolean>
      clientDefaults?: Client
      clockTolerance?: number
      conformIdTokenClaims?: boolean
      cookies?: {
        keys: Keygrip[]
        long: {
          httpOnly?: boolean
          maxAge?: number
          overwrite?: boolean
          // TODO: find out the valid strings for same site
          sameSite?: 'none' | 'lax' | 'strict'
        }
        names?: {
          interaction?: string
          resume?: string
          session?: string
          state?: string
        }
        short?: {
          httpsOnly?: boolean
          maxAge?: number
          overwrite?: boolean
          sameSite?: 'none' | 'lax' | 'strict'
        }
      }
      discovery?: {
        [property: string]: any
      }
      dynamicScopes?: RegExp[]
      expiresWithSession?: (ctx: Context, token: string) => Promise<boolean>
      extraAccessTokenClaims?: (ctx: Context, token: string) => Promise<{ [key: string]: string }>
      extraClientMetadata?: {
        properties?: string[]
        validator?: (key: string, value: any, metadata: { [key: string]: any }) => void
      }
      extraParams?: string[]
      formats?: {
        // TODO What does the client_credientials configuration look like (not listed here yet but referenced in documentation)
        jwtAccessTokenSigningAlg?: (ctx: Context, token: string, client: Client) => SigningAlgValue
        AccessToken?: 'jwt' | 'opaque' | 'paseto' | ((ctx: Context, token: string) => 'jwt' | 'opaque')
        default?: 'jwt' | 'opaque' | 'paseto' | ((ctx: Context, token: string) => 'jwt' | 'opaque')
      }
      httpsOptions?: (options: GotOptions<string>) => GotOptions<string>
      interactions?: {
        policy?: interactionPolicy.Prompt[]
        url?: (ctx: Context, interaction?: string) => Promise<string>
      }
      introspectionEndpointAuthMethods?: AuthMethod[]
      issueRefreshToken?: (ctx: Context, client: Client, code: string) => Promise<string>
      logoutSource?: (ctx: Context, form: string) => Promise<void>
      pairwiseIdentifier?: (ctx: Context, accountId: string, client: any) => Promise<string>
      pkceMethods?: ('S256' | 'plain')[]
      postLogoutSuccessSource?: (ctx: Context) => string
      renderError?: (ctx: Context, out: { [errorName: string]: string }, error: Error) => string
      responseTypes?: string[]
      revocationEndpointAuthMethods?: AuthMethod[]
      rotateRefreshToken?: boolean | ((ctx: Context) => boolean)
      routes?: {
        authorization?: string
        check_session?: string
        code_verification?: string
        device_authorization?: string
        end_session?: string
        introspection?: string
        jwks?: string
        registration?: string
        revocation?: string
        token?: string
        userinfo?: string
      }
      scopes?: string[]
      subjectTypes?: SubjectType
      tokenEndpointAuthMethods?: AuthMethod[]
      ttl?: {
        AccessToken?: number | ((ctx: Context, token: string, client: Client) => number)
        AuthorizationCode?: number | ((ctx: Context, token: string, client: Client) => number)
        ClientCredentials?: number | ((ctx: Context, token: string, client: Client) => number)
        DeviceCode?: number | ((ctx: Context, token: string, client: Client) => number)
        IdToken?: number | ((ctx: Context, token: string, client: Client) => number)
        RefreshToken?: number | ((ctx: Context, token: string, client: Client) => number)
      }
      whitelistedJWA?: {
        authorizationEncryptionAlgValues?: EncryptionAlgValue[]
        authorizationEncryptionEncValues?: EncryptionEncValue[] 
        authorizationSigningAlgValues?: SigningAlgValue[]
        dPoPSigningAlgValues?: SigningAlgValue[]
        idTokenEncryptionAlgValues?: EncryptionAlgValue[]
        idTokenEncryptionEncValues?: EncryptionEncValue[]
        idTokenSigningAlgValues?: ('none' | SigningAlgValue)[]
        introspectionEncryptionAlgValues?: EncryptionAlgValue[]
        introspectionEncryptionEncValues?: EncryptionEncValue[]
        introspectionEndpointAuthSigningAlgValues?: SigningAlgValue[]
        introspectionSigningAlgValues?: ('none' | SigningAlgValue)[]
        requestObjectEncryptionAlgValues?: EncryptionAlgValue[]
        requestObjectEncryptionEncValues?: EncryptionEncValue[]
        requestObjectSigningAlgValues?: ('none' | SigningAlgValue)[]
        revocationEndpointAuthSigningAlgValues?: SigningAlgValue[]
        tokenEndpointAuthSigningAlgValues?: SigningAlgValue[]
        userinfoEncryptionAlgValues?: EncryptionAlgValue[]
        userinfoEncryptionEncValues?: EncryptionEncValue[]
        userinfoSigningAlgValues?: ('none' | SigningAlgValue)[]
      }
    }

    // TODO: guarntee this is what a session looks like
    interface Session {
      _id: string;
      accountId: string | null;
      expiresAt: Date;
      save(time: number): Promise<void>;
      sidFor(client_id: string): boolean;
      login: {};
      interaction: {
        error?: "login_required";
        error_description: string;
        reason: "no_session" | "consent_prompt" | "client_not_authorized";
        reason_description: string;
      };
      params: {
        client_id: string;
        redirect_uri: string;
        response_mode: "query";
        response_type: "code";
        login_hint?: string;
        scope: "openid";
        state: string;
      };
      returnTo: string;
      signed: null;
      uuid: string;
      id: string;
    }

    interface InteractionResult {
      login?: {
        account: string,
        acr?: string,
        remember?: boolean,
        ts?: number
      }
      consent?: {
        rejectedScopes?: string[]
        rejectedClaims?: string[]
      }
      meta?: {}
      error?: string
      error_description?: string
    }

    class OIDCProviderError extends Error {
      name: string;
      message: string;
      error: string;
      status: number;
      statusCode: number;
      expose: boolean
      constructor(status: number, message: string)
    }

    // TODO confirm that the error namespace matches up properly
    namespace errors {

      class AccessDenied extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class AuthorizationPending extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class ConsentRequired extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class ExpiredToken extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class InteractionRequired extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class InvalidClient extends OIDCProviderError {
        constructor(detail: any)
      }

      class InvalidClientAuth extends OIDCProviderError {
        constructor(detail: any)
      }

      class InvalidClientMetadata extends OIDCProviderError {
        constructor(description: string)
      }

      class InvalidGrant extends OIDCProviderError {
        constructor(detail: any)
      }

      class InvalidRequest extends OIDCProviderError {
        constructor(description: string, code: number)
      }

      class InvalidRequestObject extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class InvalidRequestUri extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class InvalidScope extends OIDCProviderError {
        constructor(description: string, scope: string)
      }

      class InvalidSoftwareStatement extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class InvalidTarget extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class InvalidToken extends OIDCProviderError {
        constructor(detail: any)
      }

      class LoginRequired extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class RedirectUriMismatch extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class RegistrationNotSupported extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class RequestNotSupported extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class RequestUriNotSupported extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class SessionNotFound extends InvalidRequest { }

      class SlowDown extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class TemporarilyUnavailable extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class UnapprovedSoftwareStatement extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class UnauthorizedClient extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class UnsupportedGrantType extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class UnsupportedResponseMode extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class UnsupportedResponseType extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

      class WebMessageUriMismatch extends OIDCProviderError {
        constructor(description: string, detail: any)
      }

    }

    namespace interactionPolicy {
      class Check {
        reason: string
        description: string
        error: Error
        check: (ctx: Context) => boolean
        details: any
        constructor(
          reason: string,
          description: string,
          error: Error,
          check: (ctx: Context) => boolean,
          details: any
        )
      }

      class Prompt {
        name: string
        rquestable: boolean
        checks: Check[]
        constructor(options: { name?: string, requestable?: boolean }, details: any, ...checks: Check[])
        // TODO is it possible to get a more specific return type?
        details: (ctx: Context) => { [key: string]: any }
      }

      // TODO: fill out what base returns
      function base(): any;

    }
  }
}
