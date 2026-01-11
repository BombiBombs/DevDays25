import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import {
    ATTR_SERVICE_NAME,
    ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ConsoleMetricExporter, MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { metrics } from '@opentelemetry/api';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';




class SimpleExporter {
    _store = [];

    export(spans, resultCallback) {
        this._store.push(...spans);
        // console.log(`Exported ${spans.length} spans`);
        resultCallback({ code: 0 });
    }

    shutdown() {
        return Promise.resolve();
    }

    getFinishedSpans() {
        return this._store;
    }
}
const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'my-node-service',
    [ATTR_SERVICE_VERSION]: '1.0.0',
});
export const traceExporter = new SimpleExporter();
const tracerProvider = new NodeTracerProvider({
    resource,
    spanProcessors: [
        new SimpleSpanProcessor(new ConsoleSpanExporter()),
        new SimpleSpanProcessor(traceExporter),
    ],
});

tracerProvider.register();

registerInstrumentations({
    instrumentations: [
        new HttpInstrumentation({
            ignoreIncomingRequestHook(req) {
                return req.url?.includes('/telemetry');
            },
        }),
    ],
});
const prometheusExporter = new PrometheusExporter({
    port: 9464, // Puerto donde Prometheus hará el 'scrape'
    endpoint: '/metrics',
}, () => {
    console.log('Prometheus metrics server started on http://localhost:9464/metrics');
});

const meterProvider = new MeterProvider({
    resource: resource,
    readers: [
        prometheusExporter,
        new PeriodicExportingMetricReader({
            exporter: new ConsoleMetricExporter(),
            exportIntervalMillis: 5000,
        })
    ],
});
// Registrar globalmente
metrics.setGlobalMeterProvider(meterProvider);

const meterIssue = metrics.getMeter('auditIssue-service-meter');
const BUG_UMBRAL= 20;
export const issueGauge = meterIssue.createGauge('audit_open_issues_count', {
    description: 'Número de issues abiertas detectados en las auditorías',
    unit : 'number',

});


const meter = metrics.getMeter('weather-service-meter');
export const endpointDuration = meter.createHistogram('http_server_duration', {
    description: 'Tiempo de respuesta de mis endpoints en ms',
    unit: 'ms',
});
