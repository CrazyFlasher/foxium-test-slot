class Preloader
{
    private readonly progress: HTMLElement;

    public constructor()
    {
        this.progress = document.querySelector(".progress")!;

        const script = document.createElement("script");

        const xhr = new XMLHttpRequest();
        xhr.open("GET", "./App.js", true);

        xhr.onload = () =>
        {
            if (xhr.readyState === 4)
            {
                if (xhr.status === 200)
                {
                    script.text = xhr.responseText;
                    document.head.appendChild(script);
                }
                else
                {
                    console.log("Error on loading App.js");
                }
            }
        };

        xhr.onprogress = e =>
        {
            const total = e.lengthComputable ? e.total : 1000000;

            this.update(e.loaded / total);
        };

        xhr.send();
    }

    private update(progress: number): void
    {
        this.progress.style.width = `${Math.round(progress * 100)}%`;
    }

}

new Preloader();