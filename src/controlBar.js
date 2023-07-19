class ControlBar {
    constructor({
        setConfigCallback,
        deleteCallback,
        deleteAllCallback,
        applyStyleCallback,
        exportCallback,
    }) {
        this.selectedShape = null;
        this.element = document.getElementById('controlBar');
        this.setConfigCallback = setConfigCallback;
        this.applyStyleCallback = applyStyleCallback;
        this.deleteCallback = deleteCallback;
        this.deleteAllCallback = deleteAllCallback;
        this.exportCallback = exportCallback;

        this.setConfigCallback({
            size: 50,
            opacity: 100,
            fillColor: '#000000',
        });
        this.setSelectedShape = this.setSelectedShape.bind(this);
        this.unsetSelectedShape = this.unsetSelectedShape.bind(this);

        this.unsetSelectedShape();
        this.setupListeners();
    }

    hide() {
        this.element.style.display = 'hidden';
    }

    show() {
        this.element.style.display = 'flex';
    }

    setSelectedShape(shape) {
        this.unsetSelectedShape();

        this.selectedShape = shape;

        this.setDeleteButtonTextAndHandler(this.selectedShape);
        this.setConfigToShapeConfig(shape);

        document.getElementById('applyStyle').style.display = 'initial';
    }

    unsetSelectedShape() {
        if (this.selectedShape) {
            this.selectedShape.selected = false;
            this.selectedShape = null;

            this.setDeleteButtonTextAndHandler();

            document.getElementById('applyStyle').style.display = 'none';

            return true;
        }

        return false;
    }

    setConfigToShapeConfig(shape) {
        document.getElementById('circleSize').value = shape.size;
        document.getElementById('circleFillColor').value = shape.fillColor;
        document.getElementById('circleOpacity').value = shape.opacity * 100;
        document.getElementById('circleName').value = shape.name ?? '';

        this.setConfigCallback(ControlBar.extractStyleFromConfig(shape));
    }

    setDeleteButtonTextAndHandler(selectedShape) {
        if (selectedShape) {
            document.getElementById('deleteButton').textContent = `Remove ${
                selectedShape.name ?? 'selected'
            }`;
            document.getElementById('deleteButton').onclick = () => {
                if (this.selectedShape) {
                    this.deleteCallback(this.selectedShape);
                    this.unsetSelectedShape();
                }
            };

            return;
        }

        document.getElementById('deleteButton').textContent = 'Remove All';
        document.getElementById('deleteButton').onclick =
            this.deleteAllCallback;
    }

    setupListeners() {
        document.getElementById('circleSize').addEventListener('input', (e) => {
            const size = parseInt(e.target.value, 10);

            if (this.selectedShape) {
                this.selectedShape.size = size;
            }

            this.setConfigCallback({ size });
        });

        document
            .getElementById('circleOpacity')
            .addEventListener('input', (e) => {
                const opacity = parseInt(e.target.value, 10) / 100;

                if (this.selectedShape) {
                    this.selectedShape.opacity = opacity;
                }

                this.setConfigCallback({ opacity });
            });

        document.getElementById('circleName').addEventListener('input', (e) => {
            const name = e.target.value;

            if (this.selectedShape) {
                this.selectedShape.name = name;
                document.getElementById('deleteCircle').textContent = `Remove ${
                    this.selectedShape.name ?? 'selected'
                }`;
            }

            this.setConfigCallback();
        });

        document
            .getElementById('circleFillColor')
            .addEventListener('input', (e) => {
                const fillColor = e.target.value;

                if (this.selectedShape) {
                    this.selectedShape.fillColor = fillColor;
                }

                this.setConfigCallback({ fillColor });
            });

        document.getElementById('applyStyle').onclick = () => {
            if (this.selectedShape) {
                this.applyStyleCallback(
                    ControlBar.extractStyleFromConfig(this.selectedShape),
                );
            }
        };

        document.getElementById('export').onclick = () => {
            this.exportCallback();
        };
    }

    static extractStyleFromConfig(config) {
        const { fillColor, size, opacity } = config;
        return { fillColor, size, opacity };
    }
}

export default ControlBar;
