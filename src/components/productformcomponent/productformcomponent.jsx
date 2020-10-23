import React, { Component } from 'react'
import {Catergories, Manufacturers} from './../../models/constants';
import {Logic} from '././../../models/logic';
import DropDownComponent from './../reusablecomponent/dropdowncomponent';
class ProductFormComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {  
             ProductId: 0,
             ProductName: '',
             CategoryName: '',
             Manufacturer: '',
             Price:0,   
             categories: Catergories,
             manufacturers:Manufacturers,
             products:[],
             columnHeaders:[],
             IsProductID:true,
             IsProductName:true,
             IsPriceValid:true,
             IsCategoryNameValid:true,
             IsManufacturerValid:true,
             IsFormValid:true
        }
        this.logic = new  Logic();
    }


    handleChange=(evt)=>{
        this.setState({[evt.target.name]:evt.target.value});
        this.validateForm(evt.target.name, evt.target.value);
    }

    validateForm(name, value){
        if(name === "ProductId") {
            let prds = this.logic.getProducts();
            
            let index = prds.findIndex(prditem => prditem.ProductId == value);
            if(index > 0)
            {
                this.setState({IsProductID:false});
                this.setState({IsFormValid:false});                 
            }
            else
            {
                this.setState({IsProductID:true});
                this.setState({IsFormValid:true});  
            }
        }   

        if(name === "ProductName") {
            if(!/[A-Z]/.test(value[0]))
            {
                this.setState({IsProductName:false});
                this.setState({IsFormValid:false}); 
            }
            else
            {
                this.setState({IsProductName:true});
                this.setState({IsFormValid:true}); 
            }
       }   

       if(name === "Price")
       {
           if(this.state.CategoryName === "Electronics")
           {
               if(value < 2000)
               {
                this.setState({IsPriceValid:false});
                this.setState({IsFormValid:false}); 

               }
               else
               {
                this.setState({IsPriceValid:true});
                this.setState({IsFormValid:true}); 

               }
           }
       }

       if(name === "CategoryName")
       {
           if(value === "Select Data")
           {
            this.setState({IsCategoryNameValid:false});
            this.setState({IsFormValid:false}); 
           }
           else
           {
            this.setState({IsCategoryNameValid:true});
            this.setState({IsFormValid:true}); 
           }
       }

       if(name === "Manufacturer")
       {
           if(value === "Select Data")
           {
            this.setState({IsManufacturerValid:false});
            this.setState({IsFormValid:false}); 
           }
           else
           {
            this.setState({IsManufacturerValid:true});
            this.setState({IsFormValid:true}); 
           }
       }

   }

    // the lifecycle method of component that will be executed 
    // after the render() method is completing its 
    // execution
    componentDidMount=()=>{
         let prds = this.logic.getProducts();

         // read first record from array and read its schema
         var firstRecord = prds[0];
         var recProperties = Object.keys(firstRecord);
         // iterate over the properties and add in colunHeaders
          
         this.setState({columnHeaders: recProperties}, ()=> {
             
         });
         // async method will executes before
         // the product is completely excuted
         // to wait for products to update
         // add a callback to setState
         this.setState({products:prds}, ()=>{
              console.log(JSON.stringify(this.state.products)); 
         });
          
    }


    handleChanges=(evt)=>{
        this.setState({[evt.target.name]:evt.target.value},()=>{});
        this.handleChange(evt.target.value);
    }
    clear=()=>{
        this.setState({ProductId:0});
        this.setState({ProductName:''});
        this.setState({CategoryName:''});
        this.setState({Manufacturer:''});
        this.setState({Price:0});
    }
    getSelectedCategory=(val)=> {
        this.setState({CategoryName: val}, ()=>{});
        this.validateForm("CategoryName", val);

    }
    getSelectedManufacturer=(val)=> {
        this.setState({Manufacturer: val}, ()=>{});
        this.validateForm("Manufacturer", val);
    }
    save=()=>{
        // to read product values and update it in products array
        var prd = {
             ProductId: this.state.ProductId,
             ProductName: this.state.ProductName,
             CategoryName: this.state.CategoryName,
             Manufacturer: this.state.Manufacturer,
            Price: this.state.Price   
        };
        let prds = this.logic.addProduct(prd);
        this.setState({products:prds}, ()=>{
            console.log(JSON.stringify(this.state.products)); 
       });
    }

    handleDelete=(productIdx)=>{
        this.logic.removeProduct(productIdx);
        let prds = this.logic.getProducts();
        this.setState({products:prds}, ()=>{
            console.log(JSON.stringify(this.state.products)); });
    }
    
    render() { 
        return (
            <div className="container">
             <form>
                <div className="form-group">
                    <label>Product Id</label>
                    <input type="text" value={this.state.ProductId} 
                    name="ProductId"
                    className="form-control" onChange={this.handleChange.bind(this)}/>
                    <div className="alert alert-danger"
                      hidden={this.state.IsProductID}>
                        product id shoule be unique
                      </div>   

                </div>
                <div className="form-group">
                    <label>Product Name</label>
                    <input type="text" value={this.state.ProductName} 
                    name="ProductName"
                    className="form-control" onChange={this.handleChange.bind(this)}/>
                    <div className="alert alert-danger"
                      hidden={this.state.IsProductName}>
                        Product name to be camel case
                      </div>   
                </div>
                <div className="form-group">
                    <label>Category Name</label>
                    <DropDownComponent data={this.state.CategoryName} 
                    dataSource={this.state.categories}
                    selectedValue={this.getSelectedCategory.bind(this)}
                    ></DropDownComponent>
                   {/*  <select type="text" value={this.state.CategoryName} 
                    name="CategoryName"
                    className="form-control" onChange={this.handleChanges.bind(this)}>
                      {
                          this.state.categories.map((cat,idx)=> (
                              <option key={idx}>{cat}</option>
                          ))
                      }
                    </select>*/}
                    <div className="alert alert-danger"
                      hidden={this.state.IsCategoryNameValid}>
                        Category name is not selected
                      </div>   

                </div>
                <div className="form-group">
                    <label>Manufacturer Name</label>
                    <DropDownComponent data={this.state.Manufacturer} 
                    dataSource={this.state.manufacturers}
                    selectedValue={this.getSelectedManufacturer.bind(this)} 
                    ></DropDownComponent>
                   {/* <select type="text" value={this.state.Manufacturer} 
                    name="Manufacturer"
                    className="form-control" onChange={this.handleChanges.bind(this)}>
                    {
                        this.state.manufacturers.map((man,idx)=> (
                            <option key={idx}>{man}</option>
                        ))
                    }
                </select> */}
                    <div className="alert alert-danger"
                      hidden={this.state.IsManufacturerValid}>
                        Manufacturer is not selected
                      </div>   

                </div>
                <div className="form-group">
                    <label>Base Price</label>
                    <input type="text" value={this.state.Price}
                    name="Price"
                    className="form-control" onChange={this.handleChange.bind(this)}/>
                    <div className="alert alert-danger"
                      hidden={this.state.IsPriceValid}>
                        Price is not valid
                      </div>   

                </div>
                <div className="form-group">
                <input type="button" value="Clear" className="btn btn-warning"
                  onClick={this.clear.bind(this)}/>
                <input type="button" value="Save" className="btn btn-success"
                onClick={this.save.bind(this) } disabled={!this.state.IsFormValid}/>
                
              </div>
              </form>
              <br/>
              <table className="table table-bordered table-striped table-dark">
                   <thead>
                      <tr>
                        {
                            this.state.columnHeaders.map((col,idx)=> (
                                <th key={idx}>{col}</th>
                            ))
                        }
                      </tr>
                   </thead> 
                   <tbody>
                   {
                    this.state.products.map((prd,idx) => (
                       <tr key={idx}>
                          {
                              this.state.columnHeaders.map((col,i)=> (
                                  <td key={i}>{prd[col]}</td>
                              ))
                          } 
                          <td>
                            <input type="Button" value = "Delete"
                                    onClick = {() => this.handleDelete(idx)}/>
                          </td>
                       </tr> 
                    ))
                    }
                   </tbody>
              </table>
             {/* <table className="table table-bordered table-striped table-dark">
                 <thead>
                   <tr>
                     <th>
                       Product Id
                     </th>
                     <th>
                     Product Name
                   </th>
                   </tr>
                 </thead>
                 <tbody>
                 {
                     this.state.products.map((prd,idx) => (
                        <tr key={idx}>
                        <td>{prd.ProductId}</td>
                        <td>{prd.ProductName}</td>
                      </tr> 
                     ))
                 }
                   
                 </tbody>
              </table>*/}
            </div>
        );
    }
}
 
export default ProductFormComponent;