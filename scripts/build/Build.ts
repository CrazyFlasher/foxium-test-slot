import fs from "fs";
import * as child from 'child_process';
import esbuild, {BuildOptions} from "esbuild";
import NodeModulesPolyfillPlugin from '@esbuild-plugins/node-modules-polyfill';
import NodeGlobalsPolyfillPlugin from '@esbuild-plugins/node-globals-polyfill';
import {AbstractScript} from "../AbstractScript";

class Build extends AbstractScript
{
    private readonly DIST = "./dist";

    public constructor()
    {
        super();

        child.exec("tsc", () =>
        {
            fs.rmSync(this.DIST, {recursive: true, force: true});
            fs.mkdirSync(this.DIST + "/images", {recursive: true});

            this.toDist("./assets/template", this.DIST);
            this.toDist("./assets/fla", this.DIST + "/fla");
            this.toDist("./assets/images", this.DIST + "/images");

            const isDebug = this.args["debug"];

            const options: BuildOptions = {
                plugins: [
                    NodeModulesPolyfillPlugin(),
                    NodeGlobalsPolyfillPlugin({process: true, buffer: true}),
                ],
                entryPoints: [
                    'src/com/foxium/slot/App.ts',
                    'src/com/foxium/slot/Preloader.ts'
                ],
                sourcemap: isDebug,
                minify: !isDebug,
                keepNames: !isDebug,
                outdir: this.DIST,
                bundle: true,
                loader: {".ts": "ts"},
                define: {
                    'process.env.CONFIG': '"config.json"'
                }
            };

            if (isDebug)
            {
                options.define!['process.env.DEBUG'] = 'true';
            }

            esbuild.build(options).then(() => console.log("⚡ Done")).catch(() => process.exit(1));
        });
    }

    private toDist(input: string, output: string): void
    {
        fs.cpSync(input, output, {
            recursive: true, filter(source: string): boolean
            {
                return source.substring(source.length - 4) != ".fla";
            }
        });
    }
}

new Build();

