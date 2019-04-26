import React from 'react';
import './Serializer.css';
import Serialize from 'php-serialize';
import YAML from 'yaml';
import jsonar from 'jsonar';

class Serializer extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            result: '',
            error: '',
            resultFormat: 'json'
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleUnserialize = this.handleUnserialize.bind(this);
        this.handleSerialize = this.handleSerialize.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;

        this.setState({
            [name]: value
        });
    }

    handleUnserialize() {
        this.setState({error: ''});

        try {
            const result = Serialize.unserialize(this.state.input);

            switch (this.state.resultFormat) {
                case 'json':
                    this.setState({result: JSON.stringify(result, null, 2)});
                    break;
                case 'yaml':
                    this.setState({result: YAML.stringify(result)});
                    break;
                case 'phpArray':
                    this.setState({result: jsonar.arrify(result, {
                        prettify: true
                    })});
                    break;
            }
        } catch (e) {
            this.setState({error: e.message});
        }
    }

    handleSerialize() {
        this.setState({error: ''});

        try {
            let object = {};

            switch (this.state.resultFormat) {
                case 'json':
                    object = JSON.parse(this.state.result);
                    break;
                case 'yaml':
                    object = YAML.parse(this.state.result);
                    break;
                case 'phpArray':
                    object = jsonar.parse(this.state.result);
                    break;
            }

            this.setState({input: Serialize.serialize(object)});
        } catch (e) {
            this.setState({error: e.message});

            return false;
        }
    }

    render() {
        return (
            <div className="container serializer">
                <div className="row">
                    <div className="col-sm-6">
                        <h2>Serialized PHP string</h2>
                        <textarea
                            className="serializer__textarea"
                            name="input"
                            value={this.state.input}
                            onChange={this.handleChange}
                        />
                        <button className="btn btn-success" onClick={this.handleUnserialize}>Unserialize</button>
                    </div>
                    <div className="col-sm-6">
                        <h2>Result</h2>
                        <textarea
                            className="serializer__textarea"
                            name="result"
                            value={this.state.result}
                            onChange={this.handleChange}
                        />
                        <button className="btn btn-danger" onClick={this.handleSerialize}>Serialize</button>
                    </div>
                </div>
                <p className="serializer__error">{this.state.error}</p>
                <div className="result-format-toggle">
                    Result format:
                    <label className={'result-format-toggle__label' + (this.state.resultFormat === 'json' ? ' result-format-toggle__label--active' : '')}>
                        <input type="radio" name="resultFormat" value="json"
                               className="result-format-toggle__radio"
                               checked={this.state.resultFormat === 'json'}
                               onChange={this.handleChange}
                        /> JSON
                    </label>
                    <label className={'result-format-toggle__label' + (this.state.resultFormat === 'yaml' ? ' result-format-toggle__label--active' : '')}>
                        <input type="radio" name="resultFormat" value="yaml"
                               className="result-format-toggle__radio"
                               checked={this.state.resultFormat === 'yaml'}
                               onChange={this.handleChange}
                        /> YAML
                    </label>
                    <label className={'result-format-toggle__label' + (this.state.resultFormat === 'phpArray' ? ' result-format-toggle__label--active' : '')}>
                        <input type="radio" name="resultFormat" value="phpArray"
                               className="result-format-toggle__radio"
                               checked={this.state.resultFormat === 'phpArray'}
                               onChange={this.handleChange}
                        /> PHP Array
                    </label>
                </div>
            </div>
        );
    }
}

export default Serializer;