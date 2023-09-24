import {AbstractScript} from "./AbstractScript";
import PngQuant from "pngquant";

export class CompressPngs extends AbstractScript
{
    public constructor()
    {
        super();

        if (!this.args["in"])
        {
            this.logger.error("Path to input directory is not specified! Define it as flag --in=path_to_dir...");
            this.exit(1);
        }

        const input = this.workingDirectory + this.args["in"];

        this.getFilePathList(input, "png").forEach(value =>
        {
            this.logger.info("Compressing: ", value.path);

            const png = new PngQuant(['--ext', '.png', '--force', '--speed', '1', '--posterize',
                'ARGB4444', '--quality', '0-100', '--nofs', '-']);

            const inputBuffer = this.fs.createReadStream(value.path);
            const outputBuffer = this.fs.createWriteStream(value.path + "_compressed");

            outputBuffer.on("finish", () =>
            {
                this.fs.rmSync(value.path);
                this.fs.renameSync(value.path + "_compressed", value.path);
            });

            inputBuffer.pipe(png).pipe(outputBuffer);

            // setTimeout(() => this.fs.rmSync(value.path), 5000);
        });
    }
}

new CompressPngs();